import Game from "@/pages/game"
import Home from "@/pages/home"
import WaitingRoom from "@/pages/waiting-room"
import {socket} from "@/services/socket"
import {useAppStore} from "@/stores/app-store"
import {useEffect} from "react"

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
    switch (view) {
        case "menu":
            return <Home />
        case "waiting-room":
            return <WaitingRoom />
        case "in-game":
            return <Game />
    }
}
