import {Spinner} from "@/components/ui/spinner"
import {cn} from "@/lib/utils"
import Game from "@/pages/game"
import Home from "@/pages/home"
import WaitingRoom from "@/pages/waiting-room"
import socket from "@/services/socket"
import {useAppStore} from "@/stores/app-store"
import {useEffect, useState} from "react"

export default function App() {
    const view = useAppStore((state) => state.view.view)
    const setView = useAppStore((state) => state.setView)
    const addMessage = useAppStore((state) => state.addMessage)
    useEffect(() => {
        const listener = socket.on("view", (newView) => {
            setView(newView)
        })
        return () => {
            listener.off()
        }
    }, [setView])
    useEffect(() => {
        const listener = socket.on("receive-message", (message) => {
            addMessage(message)
        })
        return () => {
            listener.off()
        }
    }, [addMessage])
    const [online, setOnline] = useState(false)
    useEffect(() => {
        const listener1 = socket.on("connect", () => {
            setOnline(true)
        })
        const listener2 = socket.on("disconnect", () => {
            setOnline(false)
        })
        const listener3 = socket.on("connect_error", () => {
            setOnline(false)
        })
        return () => {
            listener1.off()
            listener2.off()
            listener3.off()
        }
    }, [])
    return (
        <>
            <div
                className={cn(
                    "bg-destructive fixed top-0 right-0 flex items-center justify-center gap-2 px-2 py-1 text-lg font-medium transition-all",
                    online ? "opacity-0" : "opacity-100",
                )}
            >
                OFFLINE <Spinner className="size-6" />
            </div>
            {view === "menu" && <Home />}
            {view === "waiting-room" && <WaitingRoom />}
            {view === "in-game" && <Game />}
        </>
    )
}
