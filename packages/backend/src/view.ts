import {players} from "./game"
import type {Cosmetics, Player} from "./player"

export type View =
    | {
          view: "menu"
          playerID: string
          cosmetics: Cosmetics
      }
    | {
          view: "waiting-room"
          playerID: string
          roomID: string
          players: {
              ID: string
              cosmetics: Cosmetics
              isReady: boolean
              isOwner: boolean
          }[]
          clockEndTime?: string
      }
    | {
          view: "in-game"
          playerID: string
          roomID: string
          players: {
              ID: string
              cosmetics: InstanceType<typeof Cosmetics>
              state: "drawing" | "guessing" | "guessed"
              isOwner: boolean
          }[]
          hint?: string
          wordChoices?: string[]
          drawing?: string
          clockEndTime?: string
          round: number
          waiting: boolean
      }

export function createView(player: Player): View {
    if (!player.room) {
        return {view: "menu", playerID: player.ID, cosmetics: player.cosmetics}
    }
    if (player.room.notready) {
        return {
            view: "waiting-room",
            playerID: player.ID,
            roomID: player.room.ID,
            players: player.room.players.map((pid) => {
                const p = players.get(pid)!
                return {
                    ID: p.ID,
                    cosmetics: p.cosmetics,
                    isReady: p.ready,
                    isOwner: player.room!.owner == p.ID,
                }
            }),
            clockEndTime: player.room.clockEndTime,
        }
    }
    return {
        view: "in-game",
        playerID: player.ID,
        roomID: player.room.ID,
        players: player.room.players.map((pid) => {
            const p = players.get(pid)!
            let state: "drawing" | "guessing" | "guessed" = "guessing"
            if (p.room!.drawer == p.ID) state = "drawing"
            else if (p.guessed) state = "guessed"
            return {
                ID: p.ID,
                cosmetics: p.cosmetics,
                state,
                isOwner: player.room!.owner == p.ID,
            }
        }),
        hint:
            player.ID == player.room.drawer ? player.room.word
            : player.room.word ? "_".repeat(player.room.word.length)
            : undefined,
        wordChoices:
            player.ID == player.room.drawer ? player.room.wordChoices : undefined,
        drawing: player.room.drawing,
        clockEndTime: player.room.clockEndTime,
        round: player.room.round,
        waiting: player.room.waiting,
    }
}
