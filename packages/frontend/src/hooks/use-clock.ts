import {deserializeTimestamp} from "@/lib/datetime"
import {differenceInSeconds} from "date-fns"
import {Howl} from "howler"
import {useEffect, useMemo, useState} from "react"

const tickSound = new Howl({src: "tick.mp3"})

export function useClock(clock?: string) {
    const target = useMemo(() => deserializeTimestamp(clock), [clock])
    const [now, setNow] = useState(() => Date.now())
    useEffect(() => {
        if (!target) return
        const interval = setInterval(() => setNow(Date.now()), 100)
        return () => clearInterval(interval)
    }, [target])
    const secondsLeft = target ? Math.max(0, differenceInSeconds(target, now)) : null
    useEffect(() => {
        if (secondsLeft && secondsLeft < 5) {
            tickSound.play()
        }
    }, [secondsLeft])
    return secondsLeft
}
