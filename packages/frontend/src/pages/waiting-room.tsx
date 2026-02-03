import {Input} from "@/components/ui/input"
import {Toggle} from "@/components/ui/toggle"
import {AppChat} from "@/features/app-chat"
import {useClock} from "@/hooks/use-clock"
import {panic} from "@/lib/utils"
import socket from "@/services/socket"
import {useAppStore} from "@/stores/app-store"
import {ThumbsUp, User} from "lucide-react"

export default function WaitingRoom() {
    const view = useAppStore((state) => state.view)
    if (view.view != "waiting-room") panic()
    const {playerID, players, roomID, clockEndTime} = view
    const clock = useClock(clockEndTime)
    const isReady = players.find((p) => p.ID === playerID)?.isReady ?? false
    function onReadyPress() {
        socket.emit("update-ready", !isReady)
    }
    return (
        <div className="flex h-full flex-col">
            <img className="mr-auto mb-2 w-32" src="skriptl.svg" alt="Skriptl" />
            <div className="grid min-h-0 flex-1 grid-cols-[24rem_1fr] gap-4">
                <div className="flex flex-col">
                    <div className="mb-4 flex flex-col gap-2">
                        {players.map((player) => (
                            <div
                                key={player.ID}
                                className="bg-muted flex items-center gap-2 rounded-xl px-4 py-2"
                            >
                                <User />
                                <span className="font-medium">{player.name}</span>
                                {player.ID == playerID && (
                                    <span className="text-muted-foreground font-medium">
                                        (You)
                                    </span>
                                )}
                                {player.isReady && <ThumbsUp className="size-4" />}
                            </div>
                        ))}
                    </div>
                    <div className="mt-auto mb-2 flex flex-col gap-2 rounded-xl border p-2 shadow-2xl">
                        <Input
                            className="text-muted-foreground border-none font-medium"
                            value={roomID}
                            readOnly
                        />
                        <span className="text-muted-foreground text-center text-xs">
                            Share this room code to invite others
                        </span>
                    </div>
                    <Toggle
                        variant="default"
                        size="sm"
                        pressed={isReady}
                        onClick={onReadyPress}
                        className="mx-auto"
                    >
                        I&apos;m Ready
                        <ThumbsUp />
                    </Toggle>
                    <span className="text-muted-foreground mt-2 text-center text-xs">
                        {players.length < 3 ?
                            "At least 3 players required..."
                        : clock ?
                            `Starting game in ${clock}...`
                        :   "Waiting for others to be ready..."}
                    </span>
                </div>
                <AppChat type="chat" />
            </div>
        </div>
    )
}
