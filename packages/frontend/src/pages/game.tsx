import {Button} from "@/components/ui/button"
import {AppChat} from "@/features/app-chat"
import Editor from "@/features/app-editor"
import {useClock} from "@/hooks/use-clock"
import {useDiffArray, useDiffValue} from "@/hooks/use-diff"
import {panic} from "@/lib/utils"
import {useAppStore} from "@/stores/app-store"
import {Clock, Pencil, Smile, User} from "lucide-react"

export default function Game() {
    const view = useAppStore((state) => state.view)
    if (view.view != "in-game") panic()
    const {playerID, players, clockEndTime, hint, wordChoices, round} = view
    const clock = useClock(clockEndTime)
    const addMessage = useAppStore((state) => state.addMessage)

    const currentPlayer = players.find((p) => p.ID === playerID)
    const isDrawing = currentPlayer?.state === "drawing" || !!wordChoices

    const drawerName = players.find((p) => p.state === "drawing")?.name
    const playerNames = players.map((p) => p.name)

    useDiffValue(drawerName, (newDrawer) => {
        if (newDrawer) {
            addMessage({type: "system", content: `${newDrawer} is drawing`})
        }
    })

    useDiffArray(playerNames, {
        add: (newPlayers) => {
            newPlayers.forEach((player) => {
                addMessage({type: "system", content: `${player} joined`})
            })
        },
        remove: (leftPlayers) => {
            leftPlayers.forEach((player) => {
                addMessage({type: "system", content: `${player} disconnected`})
            })
        },
    })

    return (
        <>
            <img className="mr-auto mb-2 w-32" src="skriptl.svg" alt="Skriptl" />
            <div className="grid min-h-0 grow grid-cols-[16rem_1fr_16rem] gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">Round {round + 1}</span>
                        {clock && (
                            <span className="flex items-center gap-1 text-lg font-medium">
                                <Clock className="size-4" />
                                {clock}
                            </span>
                        )}
                    </div>
                    {players.map((player) => (
                        <div
                            key={player.ID}
                            className="bg-muted flex items-center gap-2 rounded-xl px-4 py-2"
                        >
                            <User className="size-4" />
                            <span className="font-medium">{player.name}</span>
                            {player.ID == playerID && (
                                <span className="text-muted-foreground font-medium">
                                    (You)
                                </span>
                            )}
                            {player.state == "drawing" && <Pencil className="size-4" />}
                            {player.state == "guessed" && <Smile className="size-4" />}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                    {isDrawing && wordChoices && wordChoices.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <p className="text-center font-medium">
                                Choose a word to draw:
                            </p>
                            <div className="flex gap-2">
                                {wordChoices.map((word) => (
                                    <Button key={word} variant="outline" size="lg">
                                        {word}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="text-3xl font-bold tracking-widest">{hint}</div>
                    <Editor isDrawing={isDrawing} />
                </div>
                <AppChat type="guess" hideInput={isDrawing} />
            </div>
        </>
    )
}
