/**
 * The privacy setting of a paste.
 */
export type Privacy = 0 | 1 | 2 | "public" | "unlisted" | "private"

export function resolvePrivacy(input: string | number): 0 | 1 | 2 {
    if (typeof input === "number" && ![0, 1, 2].includes(input))
        throw new TypeError("As a number, Privacy must be 0, 1, or 2.")

    const values = ["public", "unlisted", "private"]
    if (typeof input === "number") return <0 | 1 | 2>input
    else return <0 | 1 | 2>values.indexOf(input)
}
