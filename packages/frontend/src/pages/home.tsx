import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {PageCard, PageHeader, PageLayout} from "@/layouts/page-layout"
import {socket} from "@/services/socket"
import {useState} from "react"

export default function Home() {
    const [roomID, setRoomID] = useState("")
    const [error, setError] = useState("")

    function onJoinRoomPress() {
        if (!roomID.trim()) {
            setError("Please enter a room ID")
            return
        }
        socket.emit("join-room", roomID, (success) => {
            if (!success) {
                setError("Failed to join room. Room may not exist.")
            }
        })
    }

    function onCreateRoomPress() {
        socket.emit("create-room", (newRoomID) => {
            if (!newRoomID) {
                setError("Failed to create room")
            }
        })
    }
    return (
        <PageLayout containerClassName="max-w-md">
            <PageHeader
                title="Turtle Game"
                subtitle="Join the fun or create your own room"
                icon="🐢"
            />

            <PageCard>
                <div className="space-y-2">
                    <p className="text-muted-foreground text-center text-sm">
                        Enter a room ID to join an existing game
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="room-id">Room ID</Label>
                        <Input
                            id="room-id"
                            type="text"
                            placeholder="Enter room ID..."
                            value={roomID}
                            onChange={(e) => {
                                setRoomID(e.target.value)
                                setError("")
                            }}
                        />
                        {error && <p className="text-destructive text-sm">{error}</p>}
                    </div>

                    <Button className="w-full" size="lg" onClick={onJoinRoomPress}>
                        Join Room
                    </Button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="border-border w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card text-muted-foreground px-2">Or</span>
                    </div>
                </div>

                <Button
                    variant="secondary"
                    className="w-full"
                    size="lg"
                    onClick={onCreateRoomPress}
                >
                    Create New Room
                </Button>
            </PageCard>

            <p className="text-muted-foreground mt-6 text-center text-sm">
                Ready to play? Choose your option above
            </p>
        </PageLayout>
    )
}
