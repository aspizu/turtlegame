import {Input} from "@/components/ui/input"
import {panic} from "@/lib/utils"
import {useAppStore} from "@/stores/app-store"

export default function WaitingRoom() {
    const view = useAppStore((state) => state.view)
    if (view.view != "waiting-room") panic()
    const {name, playerID, players, roomID, clockEndTime} = view
    return (
        <>
            <img className="mb-2 w-64" src="skriptl.svg" alt="Skriptl" />
            <div>
                {players.map((player) => (
                    <div key={player.ID} className="">
                        <span className="font-medium">{player.name}</span>
                        {player.isReady && <span>👍</span>}
                    </div>
                ))}
            </div>
            <div className="">
                <Input
                    className="text-muted-foreground border-none font-medium"
                    value={roomID}
                />
                <span className="text-muted-foreground text-center text-xs">
                    Share this room code to invite others
                </span>
            </div>
        </>
    )
}
