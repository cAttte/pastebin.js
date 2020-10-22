import PastebinClient from "./PastebinClient"
import UserPasteStore from "./stores/UserPasteStore"
import User from "./User"
import { Expiry } from "../typedefs/Expiry"
import { Privacy } from "../typedefs/Privacy"

/**
 * The Pastebin user of the logged in client.
 */
export default class ClientUser extends User {
    /**
     * The user's username
     */
    username: string
    /**
     * The user's format setting
     */
    format?: string
    /**
     * The user's expiry setting
     * @type {Expiry?}
     */
    expiry?: Expiry
    /**
     * The user's avatar URL
     */
    avatarURL?: string
    /**
     * The user's privacy setting
     * @type {Privacy?}
     */
    privacy?: Privacy
    /**
     * The user's website URL
     */
    website?: string
    /**
     * The user's e-mail
     */
    email?: string
    /**
     * The user's location
     */
    location?: string
    /**
     * Whether the user is a PRO account
     */
    pro?: boolean
    /**
     * All of this user's cached pastes.
     */
    pastes: UserPasteStore

    /**
     * @param client The client used to get this user
     * @param data The data obtained from the API
     */
    constructor(client: PastebinClient, data: any) {
        super(client, client.credentials.username)

        this.client = client
        this.username = data.username
        this.format = data.format || null
        this.expiry = data.expiry || null
        this.avatarURL = data.avatarURL
        this.privacy = data.privacy
        this.website = data.website || null
        this.email = data.email || null
        this.location = data.location || null
        this.pro = data.pro
        this.pastes = new UserPasteStore(client, this)
    }
}
