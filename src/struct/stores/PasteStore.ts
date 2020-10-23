import fetch from "node-fetch"

import PastebinClient from "../PastebinClient"
import PastebinError from "../PastebinError"
import Paste from "../Paste"
import { Format } from "../../typedefs/Format"
import { Privacy, resolvePrivacy } from "../../typedefs/Privacy"
import { Expiry, resolveExpiry } from "../../typedefs/Expiry"

const ERROR_CONTENT =
    "Error, this is a private paste. If this is your private paste, please login to Pastebin first."

/**
 * Options to create a paste.
 * @typedef PasteCreateOptions
 * @property {string?} title The paste's title
 * @property {Format?} format The paste's format
 * @property {Privacy?} privacy The paste's privacy setting
 * @property {Expiry?} expiry The paste's expiry time
 */
type PasteCreateOptions = {
    /**
     * The paste's title
     */
    title?: string
    /**
     * The paste's format
     */
    format?: Format
    /**
     * The paste's privacy setting
     */
    privacy?: Privacy
    /**
     * The paste's expiry time
     */
    expiry?: Expiry
}

/**
 * A structure that holds all of the cached pastes.
 */
export default class PasteStore extends Map {
    /**
     * The client this store belongs to.
     */
    client: PastebinClient

    /**
     * @param client The client the store belongs to
     * @param entries The entries to populate the sotre with
     */
    constructor(client: PastebinClient, entries: Array<[string, Paste]> = []) {
        super()
        this.client = client
        for (const [k, v] of entries) this.set(k, v)
    }

    /**
     * Store and get a paste by its key.
     * @param data The data obtained from the API
     * @param key The paste's key
     */
    store(data: any, key: string = data.key): Paste {
        let existing = this.get(key)
        if (existing) {
            existing._apply(data)
        } else {
            existing = new Paste(this.client, data)
            this.set(key, existing)
        }
        return existing
    }

    /**
     * Fetch a paste by its key, and store it in the cache.
     * @param key The paste's key
     */
    async fetch(key: string): Promise<Paste> {
        if (this.client.credentials.userKey) {
            const body = await PastebinClient.post(PastebinClient.RAW_URL, {
                api_dev_key: this.client.credentials.apiKey,
                api_user_key: this.client.credentials.userKey,
                api_paste_key: key,
                api_option: "show_paste"
            })

            const paste = this.store({ key, content: body })
            return paste
        } else {
            const response = await fetch(PastebinClient.BASE_RAW_URL + key)
            if (response.status === 404)
                throw new PastebinError("The paste doesn't exist.")
            const content = await response.text()

            // responds with a 200...
            if (content === ERROR_CONTENT)
                throw new PastebinError("The paste is private.")

            const paste = this.store({ key, content })
            return paste
        }
    }

    /**
     * Create a paste, and store it in the cache.
     * @param content The content of the paste
     * @param options
     */
    async create(content: string, options: PasteCreateOptions = {}): Promise<Paste> {
        if (!this.client.credentials.apiKey)
            throw new PastebinError("API key is required to create a paste.")

        if (!content) throw new PastebinError("`content` argument is required.")
        if (options.privacy) options.privacy = resolvePrivacy(options.privacy)
        if (options.expiry) options.expiry = resolveExpiry(options.expiry)

        const credentials = this.client.credentials
        if (options.privacy === 2 && (!credentials.username || !credentials.password))
            throw new PastebinError(
                "Username and password are required to use the 'private' privacy setting."
            )

        const request: any = {
            api_dev_key: this.client.credentials.apiKey,
            api_option: "paste",
            api_paste_code: content
        }
        if (options.title) request.api_paste_name = options.title
        if (options.format) request.api_paste_format = options.format
        if (options.privacy) request.api_paste_private = options.privacy
        if (options.expiry) request.api_paste_expire_date = options.expiry
        const response = await PastebinClient.post(PastebinClient.POST_URL, request)

        if (response.toLowerCase() === "post limit, maximum pastes per 24h reached")
            throw new PastebinError("Post limit per 24 hours exceeded.")

        const key = response.match(/pastebin\.com\/(.+)/i)?.[1]
        if (!key) throw new PastebinError("Invalid response.")
        const paste = this.store({
            key: key,
            content: content,
            format: options.format,
            privacy: options.privacy,
            expiry: options.expiry
        })

        return paste
    }
}
