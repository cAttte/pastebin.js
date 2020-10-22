/**
 * Thrown when there's an error related to the Pastebin API or pastebin.js.
 */
export default class PastebinError extends Error {
    /**
     * @param message The error message
     */
    constructor(message: string) {
        super(message)
        this.name = "PastebinError"
    }
}
