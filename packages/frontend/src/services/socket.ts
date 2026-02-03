import {io, Socket} from "socket.io-client"
import type {
    ClientToServerEvents,
    ServerToClientEvents,
} from "../../../backend/src/protocol.ts"
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
    import.meta.env.VITE_SOCKETURL,
    {
        transports: ["websocket"],
    },
)
export default socket
