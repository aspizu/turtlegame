import _ from "lodash"
import type {Room} from "./room"

export class Cosmetics {
    constructor() {}

    update() {}
}

export class Player {
    ID: string
    name: string
    room?: Room
    cosmetics: Cosmetics
    ready: boolean
    guessed: boolean
    score: number

    constructor(ID: string) {
        this.ID = ID
        this.name = `test subject ${_.random(1000, 9999)}`
        this.cosmetics = new Cosmetics()
        this.ready = false
        this.guessed = false
        this.score = 0
    }

    updateReady(isReady: boolean): boolean {
        if (this.room?.notready && isReady == true && this.ready == false) {
            this.ready = true
            return true
        }
        if (this.room?.notready && isReady == false && this.ready == true) {
            this.ready = false
            return true
        }
        return false
    }
}
