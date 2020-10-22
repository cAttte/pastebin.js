import { encode, ParsedUrlQueryInput } from "querystring"
import fetch from "node-fetch"

import PastebinError from "./PastebinError"
import PasteStore from "./stores/PasteStore"
import UserStore from "./stores/UserStore"
import ClientUser from "./ClientUser"

/**
 * @typedef PastebinCredentials
 * @property {string?} apiKey Your Pastebin API key
 * @property {string?} username Your Pastebin username
 * @property {string?} password Your Pastebin password
 * @property {string?} userKey Your Pastebin user key, obtained when logging in
 */
type PastebinCredentials = {
    /**
     * Your Pastebin API key
     */
    apiKey?: string
    /**
     * Your Pastebin username
     */
    username?: string
    /**
     * Your Pastebin password
     */
    password?: string
    /**
     * Your Pastebin user key, obtained when logging in
     */
    userKey?: string
}

/**
 * The client used to interact with Pastebin's API
 */
export default class PastebinClient {
    static BASE_URL = "https://pastebin.com/"
    static BASE_API_URL = PastebinClient.BASE_URL + "api/"
    static BASE_RAW_URL = PastebinClient.BASE_URL + "raw/"
    static POST_URL = PastebinClient.BASE_API_URL + "api_post.php"
    static LOGIN_URL = PastebinClient.BASE_API_URL + "api_login.php"
    static RAW_URL = PastebinClient.BASE_API_URL + "api_raw.php"

    /**
     * Your Pastebin credentials.
     * @type {PastebinCredentials}
     */
    credentials: PastebinCredentials = {}
    /**
     * The user the client logged in with, if it has.
     */
    user: ClientUser
    /**
     * All of the cached users.
     */
    users: UserStore
    /**
     * All of the cached pastes.
     */
    pastes: PasteStore

    /**
     * @param apiKey Your Pastebin API key
     * @param username Your Pastebin username
     * @param password Your Pastebin password
     */
    constructor(apiKey = null, username = null, password = null) {
        this.credentials = { apiKey, username, password }
        this.user = null
        this.users = new UserStore(this)
        this.pastes = new PasteStore(this)
    }

    /**
     * Make a POST request to a Pastebin API URL.
     * @param url The URL to request
     * @param requestBody The body of the request
     */
    static async post(url: string, requestBody: object): Promise<string> {
        if (!new URL(url).protocol.startsWith("http"))
            throw new PastebinError("`url` must use the HTTP or HTTPS protocol.")
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            body: encode(<ParsedUrlQueryInput>requestBody)
        })
        const body = await response.text()

        if (body.toLowerCase().startsWith("bad api request")) {
            const error = body.slice("bad api request, ".length).toLowerCase()
            switch (error) {
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
                    throw new PastebinError(
                        "Maximum of 25 unlisted pastes for free account exceeded."
                    )
                case "maximum number of 10 private pastes for your free account":
                    throw new PastebinError(
                        "Maximum of 10 private pastes for free account exceeded."
                    )
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
     */
    async login(): Promise<PastebinClient> {
        if (!this.credentials.apiKey)
            throw new PastebinError("API key is required to login.")
        if (!this.credentials.username || !this.credentials.password)
            throw new PastebinError("Username and password are required to login.")

        const body = await PastebinClient.post(PastebinClient.LOGIN_URL, {
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
