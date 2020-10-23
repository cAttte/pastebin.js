import { parseStringPromise } from "xml2js"

import PastebinClient from "../PastebinClient"
import PastebinError from "../PastebinError"
import Paste from "../Paste"
import User from "../User"

/**
 * A structure that holds all of a user's cached pastes.
 */
export default class UserPasteStore extends Map {
    /**
     * The client this store belongs to.
     */
    client: PastebinClient
    /**
     * The user this store belongs to.
     */
    user: User

    /**
     * @param client The client the store belongs to
     * @param user The user the store belongs to
     * @param entries The entries to populate the store with
     */
    constructor(
        client: PastebinClient,
        user: User,
        entries: Array<[string, Paste]> = []
    ) {
        super()
        this.client = client
        this.user = user
        for (const [k, v] of entries) this.set(k, v)
    }

    /**
     * Fetch this user's pastes, and store them in the cache.
     * @param max The maximum number of pastes to fetch
     */
    async fetch(max: number = 50): Promise<UserPasteStore> {
        if (!this.client.credentials.apiKey)
            throw new PastebinError("API key is required to fetch a user.")
        if (!this.client.credentials.userKey)
            throw new PastebinError("User key is required to fetch a user.")

        const body = await PastebinClient.post(PastebinClient.POST_URL, {
            api_dev_key: this.client.credentials.apiKey,
            api_user_key: this.client.credentials.userKey,
            api_results_limit: max,
            api_option: "list"
        })

        if (body.toLowerCase().trim() === "no posts found.") return this
        const xmls = body.match(/<paste>[\s\S]*?<\/paste>/g) // uhh
        if (!xmls) return this

        for (const xml of xmls) {
            const parsed = await parseStringPromise(xml)
            const paste = new Paste(this.client, {
                key: parsed.paste.paste_key[0],
                date: new Date(Number(parsed.paste.paste_date[0]) * 1000),
                title: parsed.paste.paste_title[0],
                author: this.user,
                size: Number(parsed.paste.paste_size[0]),
                expiryDate: new Date(Number(parsed.paste.paste_expire_date[0]) * 1000),
                privacy: Number(parsed.paste.paste_private[0]),
                format: parsed.paste.paste_format_short[0],
                hits: Number(parsed.paste.paste_hits[0])
            })
            this.set(paste.key, paste)
        }

        return this
    }

    set(key: string, paste: Paste) {
        this.client.pastes.set(key, paste)
        super.set(key, paste)
        return this
    }
}
