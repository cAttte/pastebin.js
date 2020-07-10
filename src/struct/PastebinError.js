module.exports = class PastebinError extends Error {
    constructor(message) {
        super(message)
        this.name = "PastebinError"
    }
}