const PastebinClient = require("../PastebinClient")
const PastebinError = require("../PastebinError")
const Paste = require("../Paste")

const fetch = require("node-fetch")

/**
 * A structure that holds all of the cached pastes.
 */
module.exports = class PasteStore extends Map {
    /**
     * @param {PastebinClient} client The client the store belongs to
     * @param {Array<string, Paste>?} entries
     */
    constructor(client, entries) {
        super(entries)
        /**
         * The client this store belongs to.
         * @type {PastebinClient}
         */
        this.client = client
    }
    /**
     * Fetch a paste by its key, and store it in the cache.
     * @param {string} key The paste's key
     * @returns {Promise<Paste>}
     */
    async fetch(key) {
        if (this.client.credentials.userKey) {
            const body = await this.client.constructor.post(this.client.constructor.RAW_URL, {
                api_dev_key: this.client.credentials.apiKey,
                api_user_key: this.client.credentials.userKey,
                api_paste_key: key,
                api_option: "show_paste"
            })
            const paste = new Paste(this.client, { key, content: body })
            return paste
        } else {
            const response = await fetch(this.client.constructor.BASE_RAW_URL + key)
            if (response.status === 404)
                throw new PastebinError("The paste doesn't exist.")
            const content = await response.text()
            if (content === "Error, this is a private paste. If this is your private paste, please login to Pastebin first.") // responds with a 200...
                throw new PastebinError("The paste is private.")
            const paste = new Paste(this.client, { key, content })
            return paste
        }
    }

    /**
     * Options passed to `PasteStore#create()`.
     * @typedef PasteCreateOptions
     * @property {string?} title The paste's title
     * @property {Format?} format The paste's format
     * @property {Privacy?} privacy The paste's privacy setting
     * @property {Expiry?} expiry The paste's expiry time
     */

    /**
     * Create a paste, and store it in the cache.
     * @param {*} content The content of the paste
     * @param {PasteCreateOptions} options
     * @returns {Promise<Paste>}
     */
    async create(content, { title, format, privacy, expiry } = {}) {
        if (!this.client.credentials.apiKey)
            throw new PastebinError("API key is required to create a paste.")

        if (!content) throw new PastebinError("`content` argument is required.")
        content = DataResolvers.resolveContent(content)
        if (title) title = DataResolvers.resolveTitle(title)
        if (format) format = DataResolvers.resolveFormat(format)
        if (privacy) privacy = DataResolvers.resolvePrivacy(privacy)
        if (expiry) expiry = DataResolvers.resolvePrivacy(expiry)

        if (privacy === 2 && (!this.client.credentials.username || !this.client.credentials.password))
            throw new PastebinError("Username and password are required to use the 'private' privacy setting.")

        const requestBody = {
            api_dev_key: this.client.credentials.apiKey,
            api_option: "paste",
            api_paste_code: content
        }
        if (title) requestBody.api_paste_name = title
        if (format) requestBody.api_paste_format = format
        if (privacy) requestBody.api_paste_private = privacy
        if (expiry) requestBody.api_paste_expire_date = expiry

        const body = await this.client.constructor.post(this.client.constructor.POST_URL, requestBody)

        if (body.toLowerCase() === "post limit, maximum pastes per 24h reached")
            throw new PastebinError("Post limit per 24 hours exceeded.")
        const key = (body.match(/https?:\/\/pastebin\.com\/(.+)/i) || [])[1]
        if (!key)
            throw new PastebinError("Invalid response.")
        const paste = new Paste(this.client, { key, content, format, privacy, expiry })
        this.set(key, paste)
        return paste
    }
}