import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {ChatMessages} from "@/features/chat-messages"
import {PageCard, PageHeader, PageLayout} from "@/layouts/page-layout"
import {socket} from "@/services/socket"
import {useAppStore} from "@/stores/app-store"
import {useDebounce} from "@uidotdev/usehooks"
import {useEffect, useState} from "react"

export default function Game() {
    const view = useAppStore((state) => state.view)
    if (view.view !== "in-game") {
        throw new Error("Invalid view state for Game")
    }
    const {playerID, players, hint, drawing, clockEndTime, round, wordChoices} = view

    const [message, setMessage] = useState("")
    const [now, setNow] = useState(Date.now)
    const [localDrawing, setLocalDrawing] = useState(drawing ?? "")
    const debouncedDrawing = useDebounce(localDrawing, 300)

    useEffect(() => {
        if (!clockEndTime) return
        const interval = setInterval(() => setNow(Date.now()), 100)
        return () => clearInterval(interval)
    }, [clockEndTime])

    // Sync local drawing with server drawing when it changes
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalDrawing(drawing ?? "")
    }, [drawing])

    // Emit debounced drawing updates to the server
    useEffect(() => {
        if (debouncedDrawing !== (drawing ?? "")) {
            socket.emit("update-drawing", debouncedDrawing)
        }
    }, [debouncedDrawing, drawing])

    const drawingData = localDrawing

    const secondsRemaining =
        clockEndTime ?
            Math.max(0, Math.ceil((new Date(clockEndTime).getTime() - now) / 1000))
        :   null

    const currentPlayer = players.find((p) => p.ID === playerID)
    const isDrawing = currentPlayer?.state === "drawing"

    function handleSendMessage(e: React.FormEvent) {
        e.preventDefault()
        if (message.trim()) {
            socket.emit("send-message", message)
            setMessage("")
        }
    }

    function handleDrawingChange(value: string) {
        setLocalDrawing(value)
    }

    function handleChooseWord(word: string) {
        socket.emit("choose-word", word)
    }

    return (
        <PageLayout containerClassName="max-w-7xl">
            <PageHeader
                title={`Round ${round}`}
                subtitle={hint ?? "Waiting..."}
                icon="🎨"
            />

            <div className="grid grid-cols-12 gap-6">
                {/* Left: Players List */}
                <div className="col-span-12 md:col-span-3">
                    <PageCard>
                        <div className="space-y-4">
                            <Label>Players ({players.length})</Label>
                            <div className="border-border divide-border divide-y rounded-lg border">
                                {players.map((player) => (
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
                                        </div>
                                        <span
                                            className={`text-xs font-medium ${
                                                player.state === "drawing" ?
                                                    "text-blue-600"
                                                : player.state === "guessed" ?
                                                    "text-green-600"
                                                :   "text-muted-foreground"
                                            }`}
                                        >
                                            {player.state === "drawing" ?
                                                "✏️ Drawing"
                                            : player.state === "guessed" ?
                                                "✓ Guessed"
                                            :   "Guessing"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PageCard>
                </div>

                {/* Center: Drawing Area */}
                <div className="col-span-12 md:col-span-6">
                    <PageCard>
                        <div className="space-y-4">
                            {wordChoices && wordChoices.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Choose a word to draw</Label>
                                    <div className="flex gap-2">
                                        {wordChoices.map((word) => (
                                            <Button
                                                key={word}
                                                onClick={() => handleChooseWord(word)}
                                                variant="secondary"
                                                className="flex-1"
                                            >
                                                {word}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <Label>{isDrawing ? "Draw here" : "Canvas"}</Label>
                            <textarea
                                className="border-border text-foreground min-h-96 w-full resize-none rounded-lg border p-4 font-mono text-sm"
                                value={drawingData}
                                onChange={(e) => handleDrawingChange(e.target.value)}
                                readOnly={!isDrawing}
                                placeholder={
                                    isDrawing ? "Draw using text..." : (
                                        "Watch the artist draw..."
                                    )
                                }
                            />
                        </div>
                    </PageCard>
                </div>

                {/* Right: Chat */}
                <div className="col-span-12 md:col-span-3">
                    <PageCard>
                        <div className="flex h-full flex-col space-y-4">
                            <Label>Chat</Label>
                            <div className="flex-1 overflow-y-auto p-4">
                                <ChatMessages />
                            </div>
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Type a guess..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="flex-1"
                                    disabled={
                                        isDrawing || currentPlayer?.state === "guessed"
                                    }
                                />
                                <Button
                                    type="submit"
                                    disabled={
                                        isDrawing || currentPlayer?.state === "guessed"
                                    }
                                >
                                    Send
                                </Button>
                            </form>
                        </div>
                    </PageCard>
                </div>
            </div>

            {/* Timer at bottom */}
            <p className="text-muted-foreground mt-6 text-center text-sm">
                {secondsRemaining !== null ?
                    `Time remaining: ${secondsRemaining}s`
                :   "Waiting for next round..."}
            </p>
        </PageLayout>
    )
}
