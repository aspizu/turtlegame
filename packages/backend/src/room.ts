import _ from "lodash"
import Sqids from "sqids"
import {players} from "./game"
import type {Player} from "./player"

const sqids = new Sqids()

export class Room {
    ID: string
    players: string[]
    owner: string
    notready: boolean
    waiting: boolean
    word?: string
    wordChoices?: string[]
    round: number
    timeout?: NodeJS.Timeout
    clockEndTime?: string
    drawing?: string
    drawer?: string

    constructor(owner: Player) {
        this.ID = sqids.encode([Date.now()])
        this.owner = owner.ID
        this.players = [owner.ID]
        this.notready = true
        this.waiting = false
        this.round = 0
        owner.room = this
    }

    addPlayer(player: Player) {
        this.players.push(player.ID)
        player.room = this
    }

    removePlayer(player: Player) {
        this.players = _.without(this.players, player.ID)
        player.room = undefined
        if (this.owner != player.ID) return
        this.owner = this.players[_.random(0, this.players.length - 1)]
    }

    allReady() {
        return _.every(this.players.map((p) => players.get(p)?.ready))
    }

    allGuessed() {
        return _.every(
            this.players
                .filter((p) => p != this.drawer)
                .map((p) => players.get(p)?.guessed),
        )
    }
}
