import {compileSketch} from "@/lib/p5"
import {panic} from "@/lib/utils"
import {useAppStore} from "@/stores/app-store"
import {P5Canvas} from "@p5-wrapper/react"
import {useMemo} from "react"

export default function AppDisplay() {
    const view = useAppStore((state) => state.view)
    if (view.view != "in-game") panic()
    const {drawing} = view
    const sketch = useMemo(() => compileSketch(drawing || ""), [drawing])
    return (
        <div className="grid w-full grow grid-cols-1">
            <P5Canvas sketch={sketch} />
        </div>
    )
}
