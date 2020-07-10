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
     * @returns {Object}
     */
    static async post(url, requestBody) {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
            body: querystring.encode(requestBody)
        })
        const body = await response.text()
        if (body.toLowerCase().startsWith("bad api request")) {
            const error = body.slice("bad api request, ".length).toLowerCase()
            return { error, body: null }
        } else {
            return { body, error: null }
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

        const { error, body } = await this.constructor.post(this.constructor.LOGIN_URL, {
            api_dev_key: this.credentials.apiKey,
            api_user_name: this.credentials.username,
            api_user_password: this.credentials.password
        })

        if (error) switch (error) {
            case "invalid api_dev_key":
                throw new PastebinError("Invalid API key.")
            case "invalid login":
                throw new PastebinError("Invalid username or password.")
            case "account not active":
                throw new PastebinError("Account not active.")
            default:
                throw new PastebinError(`Unknown error: ${error}.`)
        }
        this.credentials.userKey = body.trim()
        this.user = await this.users.fetch(this.credentials.username)

        return this
    }

}