const PastebinClient = require("../../../struct/PastebinClient")
const PastebinError = require("../PastebinError")
const User = require("../User")

const xml2js = require("xml2js").parseStringPromise

/**
 * A structure that holds all of the cached users.
 */
module.exports = class UserStore extends Map {
    /**
     * @param {PastebinClient} client The client the store belongs to
     * @param {Array<string, User>?} entries
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
     * Fetch a user by their username, and store them in the cache.
     * @param {string} username The user's username
     */
    async fetch(username) {
        if (!this.client.credentials.apiKey)
            throw new PastebinError("API key is required to fetch a user.")
        if (!this.client.credentials.userKey)
            throw new PastebinError("User key is required to fetch a user.")

        const body = await this.client.constructor.post(this.client.constructor.POST_URL, {
            api_dev_key: this.client.credentials.apiKey,
            api_user_key: this.client.credentials.userKey,
            api_option: "userdetails"
        })

        let invalidResponse
        const parsed = (await xml2js(body).catch(() => invalidResponse = true)).user
        if (invalidResponse)
            throw new PastebinError("Invalid response.")
        const format = parsed.user_format_short[0]
        const expiry = parsed.user_expiration[0]
        const avatarURL = parsed.user_avatar_url[0]
        const privacy = parsed.user_private[0]
        const website = parsed.user_website[0]
        const location = parsed.user_location[0]
        const pro = parsed.user_account_type[0] === "1"
        const user = new User(this.client, {
            username, format, expiry, avatarURL, privacy, website, location, pro
        })

        this.set(username, user)
        return user
    }
}