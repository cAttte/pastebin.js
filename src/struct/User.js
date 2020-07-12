const PastebinClient = require("./PastebinClient")

/**
 * A Pastebin user.
 */
module.exports = class User {
    /**
     * @param {PastebinClient} client The client used to get the user
     * @param {string} username The user's username
     */
    constructor(client, username) {
        /**
         * The client used to get this user.
         * @type {PastebinClient}
         */
        this.client = client
        /**
         * This user's username.
         * @type {string}
         */
        this.username = username
    }

    /**
     * Whether this user is the same as the client's user.
     * @type {boolean}
     */
    get me() {
        return this.username === this.client.username
    }
}