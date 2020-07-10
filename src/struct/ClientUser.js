const User = require("./User")

/**
 * The Pastebin user of the logged in client.
 */
module.exports = class ClientUser extends User {
    /**
     * Data passed to the ClientUser constructor.
     * @typedef {Object} ClientUserData
     * @property {string} username The user's username
     * @property {string?} format The user's format setting
     * @property {Expiry?} expiry The user's expiry setting
     * @property {string} avatarURL The user's avatar URL
     * @property {Privacy?} privacy The user's privacy setting
     * @property {string?} website The user's website URL
     * @property {string?} email The user's e-mail
     * @property {string?} location The user's location
     * @property {boolean} pro Whether the user is a PRO account
     */

    /**
     * @param {PastebinClient} client The client used to get this user
     * @param {ClientUserData} data
     */
    constructor(client, data) {
        super(client)
        /**
         * The client used to get this user.
         * @type {PastebinClient}
         */
        this.client = client
        /**
         * This user's username.
         * @type {string}
         */
        this.username = data.username
        /**
         * This user's format setting.
         * @type {Format?}
         */
        this.format = data.format || null
        /**
         * This user's expiry setting,
         * @type {Expiry?}
         */
        this.expiry = data.expiry || null
        /**
         * This user's avatar URL.
         * @type {string}
         */
        this.avatarURL = data.avatarURL
        /**
         * This user's privacy setting.
         * @type {Privacy}
         */
        this.privacy = data.privacy
        /**
         * This user's website URL.
         * @type {string?}
         */
        this.website = data.website || null
        /**
         * This user's email.
         * @type {string?}
         */
        this.email = data.email || null
        /**
         * This user's location.
         * @type {string?}
         */
        this.location = data.location || null
        /**
         * Whether this user is a PRO account or not.
         * @type {boolean}
         */
        this.pro = data.pro
        /**
         * All of this user's cached pastes.
         * @type {UserPasteStore}
         */
        this.pastes = new UserPasteStore(client, this)
    }
}