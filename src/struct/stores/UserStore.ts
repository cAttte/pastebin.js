import { parseStringPromise } from "xml2js"

import PastebinClient from "../PastebinClient"
import PastebinError from "../PastebinError"
import ClientUser from "../ClientUser"
import User from "../User"

/**
 * A structure that holds all of the cached users.
 */
export default class UserStore extends Map<string, User> {
    /**
     * The client this store belongs to.
     */
    client: PastebinClient

    /**
     * @param client The client the store belongs to
     * @param entries The entries to populate the store with
     */
    constructor(client: PastebinClient, entries: Array<[string, User]> = []) {
        super()
        this.client = client
        for (const [k, v] of entries) this.set(k, v)
    }

    /**
     * Fetch a user by their username, and store them in the cache.
     * @param username The user's username
     */
    async fetch(username: string): Promise<User> {
        if (!this.client.credentials.apiKey)
            throw new PastebinError("API key is required to fetch a user.")
        if (!this.client.credentials.userKey)
            throw new PastebinError("User key is required to fetch a user.")

        const body = await PastebinClient.post(PastebinClient.POST_URL, {
            api_dev_key: this.client.credentials.apiKey,
            api_user_key: this.client.credentials.userKey,
            api_option: "userdetails"
        })

        const parsed = await parseStringPromise(body).catch(() => {
            throw new PastebinError("Invalid response.")
        })

        const data: any = { username }
        let UserConstructor: typeof User | typeof ClientUser = User
        if (username === this.client.credentials.username) {
            data.format = parsed.user.user_format_short[0]
            data.expiry = parsed.user.user_expiration[0]
            data.avatarURL = parsed.user.user_avatar_url[0]
            data.privacy = parsed.user.user_private[0]
            data.website = parsed.user.user_website[0]
            data.location = parsed.user.user_location[0]
            data.pro = parsed.user.user_account_type[0] === "1"
            UserConstructor = ClientUser
        }

        const user = new UserConstructor(this.client, data)
        this.set(username, user)
        return user
    }
}
