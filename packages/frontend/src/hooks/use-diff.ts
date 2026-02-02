import {useEffect, useRef} from "react"

export function useDiffValue<T>(value: T, callback: (value: T) => void) {
    const ref = useRef<T | undefined>(undefined)
    useEffect(() => {
        if (ref.current !== value) {
            callback(value)
            ref.current = value
        }
    }, [value, callback])
}

export function useDiffArray<T>(
    value: T[],
    {add, remove}: {add: (value: T[]) => void; remove: (value: T[]) => void},
) {
    const ref = useRef<T[]>([])
    useEffect(() => {
        if (ref.current.length != value.length) {
            const added = value.filter((v) => !ref.current!.includes(v))
            const removed = ref.current!.filter((v) => !value.includes(v))
            if (added.length > 0) {
                add(added)
            }
            if (removed.length > 0) {
                remove(removed)
            }
            ref.current = value
        }
    }, [value, add, remove])
}
