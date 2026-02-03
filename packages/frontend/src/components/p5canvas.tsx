import P5 from "p5"
import {useEffect, useRef} from "react"

export default function P5Canvas({sketch}: {sketch: (p: P5) => void}) {
    const ref = useRef<HTMLDivElement>(null)
    const p5ref = useRef<P5 | null>(null)
    useEffect(() => {
        if (!ref.current) return
        const p5 = new P5(sketch, ref.current)
        p5ref.current = p5
        return () => {
            p5.remove()
            p5ref.current = null
        }
    }, [sketch])
    return (
        <div>
            <div ref={ref} />
        </div>
    )
}
