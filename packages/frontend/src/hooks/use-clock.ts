import {useEffect, useState} from "react"

export function useClock(clock?: string) {
    const [now, setNow] = useState(Date.now)
    useEffect(() => {
        if (!clock) return
        const interval = setInterval(() => setNow(Date.now()), 100)
        return () => clearInterval(interval)
    }, [clock])
    return clock ?
            Math.max(0, Math.ceil((new Date(clock).getTime() - now) / 1000))
        :   null
}
