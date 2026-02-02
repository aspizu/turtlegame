import {useDiffValue} from "@/hooks/use-diff"
import {cn, panic} from "@/lib/utils"
import {socket} from "@/services/socket"
import {useAppStore} from "@/stores/app-store"
import Editor from "@monaco-editor/react"
import {P5Canvas} from "@p5-wrapper/react"
import {useDebounce} from "@uidotdev/usehooks"
import type P5 from "p5"
import {useEffect, useMemo, useState} from "react"

if (typeof Node === "function" && Node.prototype) {
    const originalRemoveChild = Node.prototype.removeChild
    // @ts-expect-error foo
    Node.prototype.removeChild = function (child) {
        try {
            // @ts-expect-error foo
            // eslint-disable-next-line prefer-rest-params
            return originalRemoveChild.apply(this, arguments)
        } catch (e) {
            console.error("Error in removeChild:", e, child, this)
        }
    }
}

function compileSketch(code: string): (p: P5) => void {
    let f = null
    try {
        f = new Function("p", code)
    } catch {
        // ignore
    }
    return (f ||
        ((p: P5) => {
            p.setup = () => {}
            p.draw = () => {}
        })) as (p: P5) => void
}

export default function AppEditor({isDrawing}: {isDrawing: boolean}) {
    const [code, setCode] = useState("p.setup = () => {}\np.draw = () => {}\n")
    const view = useAppStore((state) => state.view)
    if (view.view != "in-game") panic()
    const {drawing, waiting, players} = view
    const drawer = players.find((p) => p.state === "drawing")?.ID
    useEffect(() => {
        if (!isDrawing && !waiting && drawing != code && drawing) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCode(drawing)
        }
    }, [isDrawing, drawing, code, waiting])
    useDiffValue(drawer, (newDrawer) => {
        if (newDrawer) {
            const code = "p.setup = () => {}\np.draw = () => {}\n"
            setCode(code)
            socket.emit("update-drawing", code)
        }
    })
    const debouncedCode = useDebounce(code, 500)
    useEffect(() => {
        if (!isDrawing) return
        socket.emit("update-drawing", debouncedCode)
    }, [debouncedCode, isDrawing])
    const sketch = useMemo(() => compileSketch(code), [code])
    return (
        <div
            className={cn(
                "grid w-full grow",
                isDrawing ? "grid-cols-2" : "grid-cols-1",
            )}
        >
            {isDrawing && (
                <Editor
                    className="grow"
                    height="100%"
                    width="100%"
                    defaultLanguage="javascript"
                    value={code}
                    onChange={(value) => setCode(value || "")}
                />
            )}
            <P5Canvas sketch={sketch} />
        </div>
    )
}
