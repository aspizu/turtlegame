import Editor from "@monaco-editor/react"
import {P5Canvas} from "@p5-wrapper/react"
import {useDebounce} from "@uidotdev/usehooks"
import type P5 from "p5"

import {cn, panic} from "@/lib/utils"
import {socket} from "@/services/socket"
import {useAppStore} from "@/stores/app-store"
import {useEffect, useMemo, useState} from "react"

function compileSketch(code: string) {
    const f = new Function(code)
    return f as (p: P5) => void
}

export default function AppEditor({isDrawing}: {isDrawing: boolean}) {
    const [code, setCode] = useState("p.setup = () => {}\np.draw = () => {}\n")
    const view = useAppStore((state) => state.view)
    if (view.view != "in-game") panic()
    const {drawing} = view
    if (!isDrawing) {
        setCode(drawing ?? "")
    }
    const debouncedCode = useDebounce(code, 500)
    useEffect(() => {
        if (!isDrawing) return
        socket.emit("update-drawing", debouncedCode)
    }, [debouncedCode, isDrawing])
    const sketch = useMemo(() => compileSketch(code), [code])
    return (
        <div className={cn("grid", isDrawing ? "grid-cols-2" : "grid-cols-1")}>
            {isDrawing && (
                <Editor
                    height="90vh"
                    defaultLanguage="javascript"
                    value={code}
                    onChange={(value) => setCode(value || "")}
                />
            )}
            <P5Canvas sketch={sketch} />
        </div>
    )
}
