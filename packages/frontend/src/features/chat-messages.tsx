import {ChatBubble} from "../components/chat-bubble"
import {useAppStore} from "../stores/app-store"

export function ChatMessages() {
    const messages = useAppStore((state) => state.messages)
    const view = useAppStore((state) => state.view)

    const getPlayerName = (playerID: string) => {
        if (view.view === "waiting-room" || view.view === "in-game") {
            const player = view.players.find((p) => p.ID === playerID)
            return player?.cosmetics.name ?? playerID
        }
        return playerID
    }

    return (
        <div className="flex flex-col gap-2">
            {messages.map((message, index) => (
                <ChatBubble
                    key={index}
                    type={message.type}
                    author={getPlayerName(message.author)}
                    content={
                        message.type == "correct-guess" ?
                            "guessed the word"
                        :   message.content
                    }
                />
            ))}
        </div>
    )
}
