import {Server as Engine} from "@socket.io/bun-engine"
import {Server} from "socket.io"
import type {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from "./protocol"

export const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>()

export const engine = new Engine({
    path: "/socket.io/",
    cors: {
        origin: "*",
        credentials: true,
    },
})

io.bind(engine)
