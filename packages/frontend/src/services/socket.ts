import {io, Socket} from "socket.io-client"
import type {
    ClientToServerEvents,
    ServerToClientEvents,
} from "../../../backend/src/protocol.ts"
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io()
