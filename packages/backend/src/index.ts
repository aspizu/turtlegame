import "./game"
import {engine} from "./socket"

export default {
    ...engine.handler(),
    hostname: process.env.HOSTNAME,
    port: parseInt(process.env.PORT!),
    idleTimeout: 30,
}
