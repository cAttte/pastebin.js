export type Expiry =
    | "never"
    | "NEVER"
    | "n"
    | "N"
    | "10 minutes"
    | "10 MINUTES"
    | "10m"
    | "10M"
    | "1 hour"
    | "1 HOUR"
    | "1h"
    | "1H"
    | "1 day"
    | "1 DAY"
    | "1d"
    | "1D"
    | "1 week"
    | "1 WEEK"
    | "1w"
    | "1W"
    | "2 weeks"
    | "2 WEEKS"
    | "2w"
    | "2W"
    | "1 month"
    | "1 MONTH"
    | "1m"
    | "1M"
    | "6 months"
    | "6 MONTHS"
    | "6m"
    | "6M"
    | "1 year"
    | "1 YEAR"
    | "1y"
    | "1Y"

export function resolveExpiry(
    input: string
): "N" | "10M" | "1H" | "1D" | "1W" | "2W" | "1M" | "6M" | "1Y" {
    if (!input) return null
    const initials = input
        .split(" ")
        .map(w => w[0])
        .join("")
    return <"N" | "10M" | "1H" | "1D" | "1W" | "2W" | "1M" | "6M" | "1Y">(
        initials.toUpperCase()
    )
}
