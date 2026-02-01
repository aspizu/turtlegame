import {Button} from "@/components/ui/button"
import {ButtonGroup} from "@/components/ui/button-group"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {panic} from "@/lib/utils"
import {socket} from "@/services/socket"
import {useAppStore} from "@/stores/app-store"
import _ from "lodash"
import {Plus} from "lucide-react"
import {useState} from "react"

export default function Home() {
    const view = useAppStore((state) => state.view)
    if (view.view !== "menu") panic()
    const [name, setName] = useState(`test subject #${_.random(1000, 9999)}`)
    const [roomCode, setRoomCode] = useState("")
    const [isRoomCodeInvalid, setIsRoomCodeInvalid] = useState(false)
    function joinRoom() {
        if (!roomCode.trim()) return
        if (!name.trim()) return
        socket.emit("join-room", roomCode, name, (success) => {
            if (!success) {
                setIsRoomCodeInvalid(true)
            }
        })
    }
    function createRoom() {
        if (!name.trim()) return
        socket.emit("create-room", name, () => {})
    }
    return (
        <>
            <img className="mx-auto mb-2 w-64" src="skriptl.svg" alt="Skriptl" />
            <div className="bg-background mx-auto mb-4 flex w-64 flex-col gap-2 rounded-xl p-2">
                <Label className="ml-1">Name</Label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="bg-background mx-auto flex w-64 flex-col rounded-xl border p-2 shadow-2xl">
                <ButtonGroup className="w-full">
                    <Input
                        placeholder="Room Code"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        required
                        aria-invalid={isRoomCodeInvalid}
                    />
                    <Button variant="outline" onClick={joinRoom}>
                        Join
                    </Button>
                </ButtonGroup>
                <span className="text-muted-foreground bg-background relative z-20 my-2 inline-block text-center text-xs font-medium">
                    <div className="bg-border absolute top-[50%] z-10 h-px w-full -translate-y-[50%]" />
                    OR
                </span>
                <Button size="sm" variant="outline" onClick={createRoom}>
                    <Plus />
                    Create Room
                </Button>
            </div>
        </>
    )
}
