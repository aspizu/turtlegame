import {formatISO, isValid, parseISO} from "date-fns"

export function serializeTimestamp(date: Date): string {
    return formatISO(date, {representation: "complete"})
}

export function deserializeTimestamp(value?: string | null): Date | null {
    if (!value) return null
    const parsed = parseISO(value)
    return isValid(parsed) ? parsed : null
}
