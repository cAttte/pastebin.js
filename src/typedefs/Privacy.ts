/**
 * The privacy setting of a paste.
 */
export type Privacy = 0 | 1 | 2 | "public" | "unlisted" | "private"

export function resolvePrivacy(input: string | number): number {
    const values = ["public", "unlisted", "private"]
    return typeof input === "number" ? input : values.indexOf(input)
}
