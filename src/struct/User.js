const PastebinClient = require("./PastebinClient")
const UserPasteStore = require("./stores/UserPasteStore")

/**
 * A Pastebin user.
 */
module.exports = class User {
    /**
     * @param {PastebinClient} client The client used to get this user
     * @param {string} username The user's username
     */
    constructor(client, username) {
        this.client = client
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