import {cn, panic} from "@/lib/utils"
import {socket} from "@/services/socket"
import {useAppStore} from "@/stores/app-store"
import Editor from "@monaco-editor/react"
import {P5Canvas} from "@p5-wrapper/react"
import {useDebounce} from "@uidotdev/usehooks"
import type P5 from "p5"
import {useEffect, useMemo, useState} from "react"

function compileSketch(code: string) {
    const f = new Function("p", code)
    return f as (p: P5) => void
}

export default function AppEditor({isDrawing}: {isDrawing: boolean}) {
    const [code, setCode] = useState("p.setup = () => {}\np.draw = () => {}\n")
    const view = useAppStore((state) => state.view)
    if (view.view != "in-game") panic()
    const {drawing, waiting} = view
    useEffect(() => {
        if (!isDrawing && !waiting && drawing != code && drawing) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCode(drawing)
        }
    }, [isDrawing, drawing, code, waiting])
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
