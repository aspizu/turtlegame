import {deserializeTimestamp} from "@/lib/datetime"
import {useEffect, useMemo, useState} from "react"

export function useClock(clock?: string) {
    const target = useMemo(() => deserializeTimestamp(clock), [clock])
    const [now, setNow] = useState(Date.now)
    useEffect(() => {
        if (!target) return
        const interval = setInterval(() => setNow(Date.now()), 100)
        return () => clearInterval(interval)
    }, [target])
    return target ?
            Math.max(0, Math.ceil((target.getTime() - now) / 1000))
        :   null
}
