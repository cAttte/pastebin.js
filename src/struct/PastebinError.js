/**
 * Thrown when there's an error related to the Pastebin API or pastebin.js.
 */
module.exports = class PastebinError extends Error {
    /**
     * @param {string} message The error message
     */
    constructor(message) {
        super(message)
        this.name = "PastebinError"
    }
}