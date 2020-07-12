const PastebinClient = require("../PastebinClient")
const PastebinError = require("../PastebinError")
const Paste = require("../Paste")
const User = require("../User")

const xml2js = require("xml2js").parseStringPromise

/**
 * A structure that holds all of a user's cached pastes.
 */
module.exports = class UserPasteStore extends Map {
    /**
     * @param {PastebinClient} client The client the store belongs to
     * @param {User} user The user the store belongs to
     * @param {Array<string, Paste>?} entries
     */
    constructor(client, user, entries) {
        super(entries)
        /**
         * The client this store belongs to.
         * @type {PastebinClient}
         */
        this.client = client
        /**
         * The user this store belongs to.
         * @type {User}
         */
        this.user = user
    }
    /**
     * Fetch this user's pastes, and store them in the cache.
     * @param {number?} max The maximum number of pastes to fetch
     * @returns {Promise<UserPasteStore>}
     */
    async fetch(max = 50) {
        if (max > 1000 || max < 1 || !Number.isInteger(max))
            throw new PastebinError("`max` argument must be a, bigger than 1, smaller than 1,000 integer.")
        if (!this.client.credentials.apiKey)
            throw new PastebinError("API key is required to fetch a user.")
        if (!this.client.credentials.userKey)
            throw new PastebinError("User key is required to fetch a user.")
        const body = await this.client.constructor.post(this.client.constructor.POST_URL, {
            api_dev_key: this.client.credentials.apiKey,
            api_user_key: this.client.credentials.userKey,
            api_results_limit: max,
            api_option: "list"
        })
        if (body.toLowerCase() === "no posts found.") return this
        const allPasteXMLs = body.match(/<paste>[\s\S]*?<\/paste>/g)
        if (!allPasteXMLs) return
        allPasteXMLs.forEach(async xml => {
            const author = this.user
            const parsed = (await xml2js(xml)).paste
            const key = parsed.paste_key[0]
            const date = new Date(Number(parsed.paste_date[0]) * 1000)
            const title = parsed.paste_title[0]
            const size = Number(parsed.paste_size[0])
            const expiryDate = Date(Number(parsed.paste_expire_date[0]) * 1000)
            const privacy = Number(parsed.paste_private[0])
            const format = parsed.paste_format_short[0]
            const hits = Number(parsed.paste_hits[0])
            this.set(key, new Paste(this.client, {
                key, date, title, author, size, expiryDate, privacy, format, hits
            }))
        })
        return this
    }

    set(key, paste) {
        this.client.pastes.set(key, paste)
        super.set(key, paste)
        return this
    }
}