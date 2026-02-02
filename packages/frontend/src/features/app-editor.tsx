import {compileSketch} from "@/lib/p5"
import {socket} from "@/services/socket"
import Editor from "@monaco-editor/react"
import {P5Canvas} from "@p5-wrapper/react"
import {useDebounce} from "@uidotdev/usehooks"

import {useEffect, useMemo, useState} from "react"

export default function AppEditor() {
    const [code, setCode] = useState("p.setup = () => {}\np.draw = () => {}\n")
    const debouncedCode = useDebounce(code, 500)
    useEffect(() => {
        socket.emit("update-drawing", debouncedCode)
    }, [debouncedCode])
    const sketch = useMemo(() => compileSketch(debouncedCode), [debouncedCode])
    return (
        <div className="grid w-full grow grid-cols-2">
            <Editor
                className="grow"
                height="100%"
                width="100%"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => setCode(value || "")}
            />
            <P5Canvas sketch={sketch} />
        </div>
    )
}
