import type P5 from "p5"

export function compileSketch(code: string): (p: P5) => void {
    const fallback = (p: P5) => {
        p.setup = () => {}
        p.draw = () => {}
    }
    try {
        const f = new Function("p", code || "")
        return f as (p: P5) => void
    } catch {
        return fallback
    }
}
