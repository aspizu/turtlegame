import {Button} from "@/components/ui/button"
import {ButtonGroup} from "@/components/ui/button-group"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {panic} from "@/lib/utils"
import {socket} from "@/services/socket"
import {useAppStore} from "@/stores/app-store"
import {useDebounce} from "@uidotdev/usehooks"
import {Plus} from "lucide-react"
import {useEffect, useState} from "react"

export default function Home() {
    const view = useAppStore((state) => state.view)
    if (view.view !== "menu") panic()
    const [name, setName] = useState(view.cosmetics.name)
    const debouncedName = useDebounce(name, 300)
    if (!name && view.cosmetics.name) {
        setName(view.cosmetics.name)
    }
    useEffect(() => {
        socket.emit("update-cosmetics", {name: debouncedName})
    }, [debouncedName])
    return (
        <>
            <img className="mb-2 w-64" src="skriptl.svg" alt="Skriptl" />
            <div className="mb-4 flex flex-col gap-2 rounded-xl border p-2 shadow">
                <Label className="ml-1">Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col rounded-xl border p-2 shadow">
                <ButtonGroup>
                    <Input placeholder="Room Code" />
                    <Button variant="outline">Join</Button>
                </ButtonGroup>
                <span className="text-muted-foreground bg-background relative z-20 my-2 inline-block text-center text-xs font-medium">
                    <div className="bg-border absolute top-[50%] z-10 h-px w-full -translate-y-[50%]" />
                    OR
                </span>
                <Button size="sm" variant="outline">
                    <Plus />
                    Create Room
                </Button>
            </div>
        </>
    )
}
