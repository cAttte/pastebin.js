const PastebinError = require("./PastebinError")
const User = require("./User")
const PasteStore = require("./stores/PasteStore")
const UserStore = require("./stores/UserStore")

const querystring = require("querystring")
const fetch = require("node-fetch")

const BASE_URL = "https://pastebin.com/"
const BASE_API_URL = BASE_URL + "api/"
const BASE_RAW_URL = BASE_URL + "raw/"
const POST_URL = BASE_API_URL + "api_post.php"
const LOGIN_URL = BASE_API_URL + "api_login.php"
const RAW_URL = BASE_API_URL + "api_raw.php"

/**
 * The client used to interact with Pastebin's API
 */
module.exports = class PastebinClient {

    static BASE_URL = BASE_URL
    static BASE_API_URL = BASE_API_URL
    static BASE_RAW_URL = BASE_RAW_URL
    static POST_URL = POST_URL
    static LOGIN_URL = LOGIN_URL
    static RAW_URL = RAW_URL

    /**
     * @param {string?} apiKey Your Pastebin API key
     * @param {string?} username Your Pastebin username
     * @param {string?} password Your Pastebin password
     */
    constructor(apiKey = null, username = null, password = null) {
        /**
         * Your Pastebin credentials.
         * @type {object}
         * @property {string?} apiKey Your Pastebin API key
         * @property {string?} username Your Pastebin username
         * @property {string?} password Your Pastebin password
         */
        this.credentials = {
            apiKey, username, password
        }
        /**
         * The user the client logged in with, if it has.
         * @type {ClientUser?}
         */
        this.user = null
        /**
         * All of the cached users.
         * @type {UserStore}
         */
        this.users = new UserStore(this)
        /**
         * All of the cached pastes.
         * @type {PasteStore}
         */
        this.pastes = new PasteStore(this)
    }

    /**
     * Make a POST request to a Pastebin API URL.
     * @param {string} url The URL to request
     * @param {Object} requestBody The body of the request
     * @returns {Promise<string>}
     */
    static async post(url, requestBody) {
        if (typeof url !== "string")
            throw new PastebinError("`url` must be a string.")
        if (!new URL(url).protocol.startsWith("http"))
            throw new PastebinError("`url` must use the HTTP or HTTPS protocol.")
        if (!requestBody || typeof requestBody !== "object")
            throw new PastebinError("`requestBody` must be an object.")
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
            body: querystring.encode(requestBody)
        })
        const body = await response.text()
        if (body.toLowerCase().startsWith("bad api request")) {
            const error = body.slice("bad api request, ".length).toLowerCase()
            switch(error) {
                case "invalid login":
                    throw new PastebinError("Invalid username or password.")
                case "account not active":
                    throw new PastebinError("Account not active.")
                case "invalid api_dev_key":
                    throw new PastebinError("Invalid API key.")
                case "invalid api_user_key":
                    throw new PastebinError("Invalid user key.")
                case "invalid permission to view this paste or invalid api_paste_key":
                    throw new PastebinError("The paste is private, or it doesn't exist.")
                case "invalid permission to remove paste":
                    throw new PastebinError("No permission to delete this paste.")
                case "ip blocked":
                    throw new PastebinError("IP blocked.")
                case "maximum number of 25 unlisted pastes for your free account":
                    throw new PastebinError("Maximum of 25 unlisted pastes for free account exceeded.")
                case "maximum number of 10 private pastes for your free account":
                    throw new PastebinError("Maximum of 10 private pastes for free account exceeded.")
                case "api_paste_code was empty":
                    throw new PastebinError("Paste content is empty.")
                case "maximum paste file size exceeded":
                    throw new PastebinError("Paste content exceeds maximum length.")
                case "invalid api_expire_date":
                    throw new PastebinError("Invalid paste expiry.")
                case "invalid api_paste_private":
                    throw new PastebinError("Invalid paste privacy setting.")
                case "invalid api_paste_format":
                    throw new PastebinError("Invalid paste format.")
                case "invalid or expired api_user_key":
                    throw new PastebinError("Invalid or expired user key.")
                default:
                    throw new PastebinError(`Unknown error: ${error}.`)
            }
        } else {
            return body
        }
    }

    /**
     * Login with the stored username and password and store the user key.
     * @returns {PastebinClient}
     */
    async login() {
        if (!this.credentials.apiKey)
            throw new PastebinError("API key is required to login.")
        if (!this.credentials.username || !this.credentials.password)
            throw new PastebinError("Username and password are required to login.")

        const body = await this.constructor.post(this.constructor.LOGIN_URL, {
            api_dev_key: this.credentials.apiKey,
            api_user_name: this.credentials.username,
            api_user_password: this.credentials.password
        })

        this.credentials.userKey = body.trim()
        if (this.credentials.userKey)
            this.user = await this.users.fetch(this.credentials.username)

        return this
    }

}