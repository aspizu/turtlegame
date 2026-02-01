import type {View} from "./view"

export type Message =
    | {type: "wrong-guess"; author: string; content: string}
    | {type: "correct-guess"; author: string}
    | {type: "chat"; author: string; content: string}

export interface ServerToClientEvents {
    view: (view: View) => void
    "receive-message": (data: Message) => void
}

export interface ClientToServerEvents {
    "update-cosmetics": (cosmetics: {name: string}) => void
    "join-room": (roomID: string, callback: (success: boolean) => void) => void
    "create-room": (callback: (roomID?: string) => void) => void
    "send-message": (content: string) => void
    "update-ready": (isReady: boolean) => void
    "update-drawing": (drawing: string) => void
    "choose-word": (word: string) => void
}

export interface InterServerEvents {
    ping: () => void
}

export interface SocketData {
    name: string
    age: number
}
