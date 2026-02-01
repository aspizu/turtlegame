import _ from "lodash"
import type {Room} from "./room"

export class Cosmetics {
    name: string

    constructor() {
        this.name = `test subject #${_.random(1000, 9999)}`
    }

    update({name}: {name: string}) {
        this.name = name.trim().slice(0, 24)
    }
}

export class Player {
    ID: string
    room?: Room
    cosmetics: Cosmetics
    ready: boolean
    guessed: boolean

    constructor(ID: string) {
        this.ID = ID
        this.cosmetics = new Cosmetics()
        this.ready = false
        this.guessed = false
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
