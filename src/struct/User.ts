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
     * @param data The data obtained from the API
     */
    constructor(client: PastebinClient, data: any) {
        this.client = client
        this.username = data.username
    }

    /**
     * Whether this user is the same as the client's user.
     */
    get me(): boolean {
        return this.username === this.client.user.username
    }
}
