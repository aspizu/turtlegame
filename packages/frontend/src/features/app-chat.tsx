import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group"
import {socket} from "@/services/socket"
import {Send} from "lucide-react"
import {useCallback, useEffect, useRef, useState} from "react"
import {ChatBubble} from "../components/chat-bubble"
import {useAppStore} from "../stores/app-store"

export function AppChat({
    type,
    hideInput = false,
}: {
    type: "chat" | "guess"
    hideInput?: boolean
}) {
    const messages = useAppStore((state) => state.messages)
    const view = useAppStore((state) => state.view)
    const [msg, setMsg] = useState("")
    const ref = useRef<HTMLDivElement>(null)

    const getPlayerName = (playerID?: string) => {
        if (view.view === "waiting-room" || view.view === "in-game") {
            const player = view.players.find((p) => p.ID === playerID)
            return player?.name ?? playerID
        }
        return playerID
    }

    const onSend = useCallback(() => {
        if (!msg.trim()) return
        socket.emit("send-message", msg.trim())
        setMsg("")
    }, [msg])

    useEffect(() => {
        function onKeyPress(event: KeyboardEvent) {
            if (event.key == "Enter") {
                onSend()
            }
        }
        window.addEventListener("keypress", onKeyPress)
        return () => window.removeEventListener("keypress", onKeyPress)
    }, [onSend])

    useEffect(() => {
        if (!ref.current) return
        ref.current.scrollTop = ref.current.scrollHeight
    }, [messages.length])

    return (
        <div
            ref={ref}
            className="flex min-h-0 flex-col gap-2 overflow-scroll rounded-xl border p-2"
        >
            <div className="flex grow flex-col justify-end gap-2">
                {messages.map((message, index) => (
                    <ChatBubble
                        key={index}
                        type={message.type}
                        author={getPlayerName(
                            message.type != "system" ? message.author : undefined,
                        )}
                        content={
                            message.type == "chat" || message.type == "wrong-guess" ?
                                message.content
                            : message.type == "system" ?
                                message.content
                            :   undefined
                        }
                    />
                ))}
            </div>
            {!hideInput && (
                <div className="bg-background sticky bottom-0 z-10">
                    <InputGroup>
                        <InputGroupInput
                            placeholder={`type your ${type == "chat" ? "message" : "guess"} here...`}
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                        />
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton onClick={onSend}>
                                <Send />
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                </div>
            )}
        </div>
    )
}
