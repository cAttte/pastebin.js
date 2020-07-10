const PastebinClient = require("./PastebinClient")
const PastebinError = require("./PastebinError")

/**
 * A Pastebin paste.
 */
module.exports = class Paste {
    /**
     * @param {PastebinClient} client The client used to get this paste
     * @param {Object} data
     * @param {string} data.key The key of the paste
     * @param {string?} data.title The title of the paste
     * @param {User?} data.author The author of the paste
     * @param {string?} data.content The content of the paste
     * @param {number?} data.size The length of the content of the paste
     * @param {Date?} data.date The date the paste was posted
     * @param {Format?} data.format The format of the paste
     * @param {Privacy?} data.privacy The privacy setting of the paste
     * @param {Expiry?} data.expiry The expiry time of the paste
     * @param {Date?} data.expiryDate The expiry date of the paste
     * @param {number?} data.hits The number of times anyone saw the paste
     */
    constructor(client, data) {
        /**
         * The client used to get this paste.
         * @type {PastebinClient}
         */
        this.client = client
        /**
         * The key of this paste.
         * @type {string}
         */
        this.key = data.key
        /**
         * The title of this paste.
         * @type {string?}
         */
        this.title = data.title
        /**
         * The author of this paste.
         * @type {User?}
         */
        this.author = data.author
        /**
         * The content of this paste.
         * @type {string?}
         */
        this.content = data.content
        /**
         * The length of the content of this paste.
         * @type {number?}
         */
        this.size = data.size || (data.content || { length: null }).length
        /**
         * The date this paste was posted.
         * @type {Date?}
         */
        this.date = data.date
        /**
         * The format (syntax highlighting) of this paste.
         * @type {Format?}
         */
        this.format = data.format
        /**
         * The privacy setting of this paste.
         * @type {Privacy?}
         */
        this.privacy = data.privacy
        /**
         * The expiry time of this paste.
         * @type {Expiry?}
         */
        this.expiry = data.expiry
        /**
         * The expiry date of this paste.
         * @type {Date?}
         */
        this.expiryDate = data.expiryDate
        /**
         * The number of times anyone saw this paste.
         * @type {number?}
         */
        this.hits = data.hits
        /**
         * Whether the paste is deleted or not.
         * @type {boolean}
         */
        this.deleted = false
    }

    /**
     * The URL of this paste.
     * @type {string}
     */
    get url() {
        return this.client.constructor.BASE_URL + this.key
    }

    /**
     * Fetch the content of this paste, and store it in the cache.
     */
    async fetch() {
        const { content } = await this.client.pastes.fetch(this.key)
        this.content = content
        return this
    }

    /**
     * Delete this paste.
     */
    async delete() {
        if (!this.client.credentials.apiKey)
            throw new PastebinError("API key is required to delete a paste.")
        if (!this.client.credentials.userKey)
            throw new PastebinError("User key is required to delete a paste.")
        const { error } = await this.client.constructor.post(this.client.constructor.POST_URL, {
            api_dev_key: this.client.credentials.apiKey,
            api_user_key: this.client.credentials.userKey,
            api_option: "delete",
            api_paste_key: this.key
        })
        if (error) switch (error) {
            case "invalid api_dev_key":
                throw new PastebinError("Invalid API key.")
            case "invalid api_user_key":
                throw new PastebinError("Invalid user key.")
            case "invalid permission to remove paste":
                throw new PastebinError("No permission to delete this paste.")
            default:
                throw new PastebinError(`Unknown error: ${error}.`)
        }
        this.deleted = true
        return this
    }
}