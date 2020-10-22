import PastebinClient from "./PastebinClient"

/**
 * A Pastebin user.
 */
export default class User {
    /**
     * The client used to get this user.
     */
    client: PastebinClient
    /**
     * This user's username.
     */
    username: string

    /**
     * @param client The client used to get the user
     * @param username The user's username
     */
    constructor(client: PastebinClient, username: string) {
        this.client = client
        this.username = username
    }

    /**
     * Whether this user is the same as the client's user.
     */
    get me(): boolean {
        return this.username === this.client.user.username
    }
}
