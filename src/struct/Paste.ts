import PastebinClient from "./PastebinClient"
import PastebinError from "./PastebinError"
import User from "./User"
import { Format } from "../typedefs/Format"
import { Privacy, resolvePrivacy } from "../typedefs/Privacy"
import { Expiry, resolveExpiry } from "../typedefs/Expiry"

/**
 * A Pastebin paste.
 */
export default class Paste {
    /**
     * The client used to get this paste.
     */
    client: PastebinClient
    /**
     * The key of this paste.
     */
    key?: string
    /**
     * The title of this paste.
     */
    title?: string
    /**
     * The author of this paste.
     */
    author?: User
    /**
     * The content of this paste.
     */
    content?: string
    /**
     * The length of the content of this paste.
     */
    size?: number
    /**
     * The date this paste was posted.
     */
    date?: Date
    /**
     * The format (syntax highlighting setting) of this paste.
     * @type {Format}
     */
    format?: Format
    /**
     * The privacy setting of this paste.
     * @type {Privacy}
     */
    privacy?: Privacy
    /**
     * The expiry time of this paste.
     */
    expiry?: Expiry
    /**
     * The expiry date of this paste.
     */
    expiryDate?: Date
    /**
     * The number of times anyone saw this paste.
     */
    hits?: number
    /**
     * Whether the paste is deleted.
     */
    deleted?: boolean

    /**
     * @param client The client used to get this paste
     * @param data The data obtained from the API
     */
    constructor(client: PastebinClient, data: any) {
        this.client = client
        this.key = data.key
        this.title = data.title
        this.author = data.author
        this.content = data.content
        this.size = data.size || data.content?.length
        this.date = data.date
        this.format = data.format
        this.privacy = resolvePrivacy(data.privacy)
        this.expiry = resolveExpiry(data.expiry)
        this.expiryDate = data.expiryDate
        this.hits = data.hits
        this.deleted = data.deleted || false
    }

    /**
     * The URL of this paste.
     */
    get url(): string {
        return PastebinClient.BASE_URL + this.key
    }

    /**
     * Fetch the content of this paste, and store it in the cache.
     */
    async fetch(): Promise<Paste> {
        const { content } = await this.client.pastes.fetch(this.key)
        this.content = content
        return this
    }

    /**
     * Delete this paste.
     */
    async delete(): Promise<Paste> {
        if (!this.client.credentials.apiKey)
            throw new PastebinError("API key is required to delete a paste.")
        if (!this.client.credentials.userKey)
            throw new PastebinError("User key is required to delete a paste.")
        await PastebinClient.post(PastebinClient.POST_URL, {
            api_dev_key: this.client.credentials.apiKey,
            api_user_key: this.client.credentials.userKey,
            api_option: "delete",
            api_paste_key: this.key
        })
        this.deleted = true
        return this
    }
}
