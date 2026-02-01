import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {ChatMessages} from "@/features/chat-messages"
import {socket} from "@/services/socket"
import {useAppStore} from "@/stores/app-store"
import {useEffect, useState} from "react"

export default function WaitingRoom() {
    const view = useAppStore((state) => state.view)
    if (view.view !== "waiting-room") {
        throw new Error("Invalid view state for WaitingRoom")
    }
    const {playerID, players, roomID, clockEndTime} = view

    const currentPlayer = players.find((p) => p.ID === playerID)
    const isReady = currentPlayer?.isReady ?? false

    const [copied, setCopied] = useState(false)
    const [now, setNow] = useState(Date.now)
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (!clockEndTime) return
        const interval = setInterval(() => setNow(Date.now()), 100)
        return () => clearInterval(interval)
    }, [clockEndTime])

    const secondsRemaining =
        clockEndTime ?
            Math.max(0, Math.ceil((new Date(clockEndTime).getTime() - now) / 1000))
        :   null

    const inviteLink = `${window.location.origin}?room=${roomID}`

    function handleCopyLink() {
        navigator.clipboard.writeText(inviteLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    function handleToggleReady() {
        socket.emit("update-ready", !isReady)
    }

    function handleSendMessage(e: React.FormEvent) {
        e.preventDefault()
        if (message.trim()) {
            socket.emit("send-message", message)
            setMessage("")
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <>
                    <div className="space-y-6">
                        {/* Invite Link Section */}
                        <div className="space-y-2">
                            <Label htmlFor="invite-link">Invite Link</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="invite-link"
                                    type="text"
                                    value={inviteLink}
                                    readOnly
                                    className="flex-1"
                                />
                                <Button onClick={handleCopyLink} variant="secondary">
                                    {copied ? "✓ Copied!" : "Copy"}
                                </Button>
                            </div>
                            <p className="text-muted-foreground text-xs">
                                Share this link with others to invite them to the game
                            </p>
                        </div>

                        {/* Players List */}
                        <div className="space-y-3">
                            <Label>Players ({players.length})</Label>
                            <div className="border-border divide-border divide-y rounded-lg border">
                                {players.length === 0 ?
                                    <div className="text-muted-foreground p-4 text-center text-sm">
                                        Waiting for players to join...
                                    </div>
                                :   players.map((player) => (
                                        <div
                                            key={player.ID}
                                            className="flex items-center justify-between p-3"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-foreground font-medium">
                                                    {player.cosmetics.name}
                                                </span>
                                                {player.ID === playerID && (
                                                    <span className="text-muted-foreground text-xs">
                                                        (You)
                                                    </span>
                                                )}
                                                {player.isOwner && (
                                                    <span className="text-muted-foreground text-xs">
                                                        👑
                                                    </span>
                                                )}
                                            </div>
                                            <span
                                                className={`text-sm font-medium ${
                                                    player.isReady ? "text-green-600"
                                                    :   "text-muted-foreground"
                                                }`}
                                            >
                                                {player.isReady ?
                                                    "✓ Ready"
                                                :   "Not Ready"}
                                            </span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        {/* Ready Button */}
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleToggleReady}
                            variant={isReady ? "secondary" : "default"}
                        >
                            {isReady ? "✓ Ready" : "Mark as Ready"}
                        </Button>
                    </div>
                </>

                <>
                    <div className="flex h-full flex-col space-y-4">
                        <Label>Chat</Label>
                        <div className="flex-1 overflow-y-auto p-4">
                            <ChatMessages />
                        </div>
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit">Send</Button>
                        </form>
                    </div>
                </>
            </div>

            <p className="text-muted-foreground mt-6 text-center text-sm">
                {players.length < 3 ?
                    "At least 3 players required"
                : secondsRemaining !== null ?
                    `game starts in ${secondsRemaining}`
                :   "Game will start when all players are ready"}
            </p>
        </>
    )
}
