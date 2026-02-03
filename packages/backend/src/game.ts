import {addMilliseconds} from "date-fns"
import _ from "lodash"
import {serializeTimestamp} from "./lib/datetime"
import {Player} from "./player"
import {Room} from "./room"
import {io} from "./socket"
import {createView} from "./view"
import words from "./words.json"

export const rooms = new Map<string, Room>()
export const players = new Map<string, Player>()

function nextTurn(room: Room, sendViewForAll: () => void) {
    let nextDrawerIdx =
        room.drawer === undefined ? 0 : room.players.indexOf(room.drawer) + 1
    if (nextDrawerIdx == room.players.length) {
        nextDrawerIdx = 0
        room.round += 1
        if (room.round == 5) {
            room.round = 0
            room.notready = true
            room.waiting = true
            room.word = undefined
            room.drawer = undefined
            room.drawing = undefined
            room.clockEndTime = undefined
            for (const pid of room.players) {
                const player = players.get(pid)
                if (!player) continue
                player.ready = false
                player.guessed = false
            }
            room.players = _.shuffle(room.players)
            sendViewForAll()
            return
        }
    }
    for (const pid of room.players) {
        const player = players.get(pid)
        if (!player) continue
        player.guessed = false
    }
    room.drawing = undefined
    room.drawer = room.players[nextDrawerIdx]
    room.word = undefined
    room.wordChoices = undefined
    clearTimeout(room.timeout)
    room.waiting = true
    room.clockEndTime = serializeTimestamp(addMilliseconds(new Date(), 1_000))
    sendViewForAll()
    room.timeout = setTimeout(() => {
        room.waiting = false
        const wordChoices = _.shuffle(words).slice(0, 3)
        room.wordChoices = wordChoices
        room.clockEndTime = serializeTimestamp(addMilliseconds(new Date(), 5_000))
        sendViewForAll()
        room.timeout = setTimeout(() => {
            room.wordChoices = undefined
            room.word = wordChoices[_.random(0, 2)]
            beginDrawing(room, sendViewForAll)
        }, 5 * 1000)
    }, 1000)
}

function beginDrawing(room: Room, sendViewForAll: () => void) {
    room.clockEndTime = serializeTimestamp(addMilliseconds(new Date(), 25_000))
    sendViewForAll()
    room.timeout = setTimeout(
        () => {
            nextTurn(room, sendViewForAll)
        },
        5 * 60 * 1000,
    )
}

io.on("connection", (socket) => {
    const player = new Player(socket.id)
    players.set(socket.id, player)
    socket.emit("view", createView(player))
    const sendViewForAll = () => {
        if (!player.room) return
        for (const pid of player.room.players) {
            const p = players.get(pid)
            if (!p) continue
            io.to(p.ID).emit("view", createView(p))
        }
    }

    socket.on("request-view-update", () => {
        socket.emit("view", createView(player))
    })

    socket.on("disconnect", () => {
        players.delete(socket.id)
        if (!player.room) return
        if (_.isEmpty(player.room.players)) {
            rooms.delete(player.room.ID)
        }
        if (player.room.drawer == player.ID) {
            clearTimeout(player.room.timeout)
            player.room.timeout = undefined
            nextTurn(player.room, sendViewForAll)
        }
        player.room.removePlayer(player)
        sendViewForAll()
    })

    // socket.on("update-cosmetics", (cosmetics) => {
    //     if (!player.room || player.room.notready) return
    //     player.cosmetics.update(cosmetics)
    //     sendViewForAll()
    // })

    socket.on("join-room", (roomID, name, callback) => {
        player.name = name
        const room = rooms.get(roomID)
        if (player.room || !room) return callback(false)
        room.addPlayer(player)
        socket.join(roomID)
        callback(true)
        sendViewForAll()
    })

    socket.on("create-room", (name, callback) => {
        player.name = name
        if (player.room) return callback()
        const room = new Room(player)
        rooms.set(room.ID, room)
        socket.join(room.ID)
        callback(room.ID)
        sendViewForAll()
    })

    socket.on("update-ready", (isReady) => {
        const room = player.room
        if (!room) return
        if (!player.updateReady(isReady)) return
        if (room.timeout && !isReady) {
            clearTimeout(room.timeout)
            room.timeout = undefined
            room.clockEndTime = undefined
        }
        if (!room.timeout && room.allReady() && room.players.length >= 3) {
            room.clockEndTime = serializeTimestamp(addMilliseconds(new Date(), 5_000))
            room.timeout = setTimeout(() => {
                room.notready = false
                room.timeout = undefined
                room.clockEndTime = undefined
                nextTurn(room, sendViewForAll)
            }, 5000)
        }
        sendViewForAll()
    })

    socket.on("send-message", (content) => {
        content = content.trim()
        if (!content) return
        if (!player.room) return
        if (player.room.notready || player.room.waiting || !player.room.word) {
            io.to(player.room.ID).emit("receive-message", {
                type: "chat",
                author: player.ID,
                content,
            })
            return
        }
        if (player.room.drawer == player.ID) return
        if (player.guessed) {
            for (const pid of player.room.players) {
                const p = players.get(pid)
                if (!p?.guessed) continue
                io.to(p.ID).emit("receive-message", {
                    type: "chat",
                    author: player.ID,
                    content,
                })
            }
            return
        }
        if (content.toLowerCase() == player.room.word?.toLowerCase()) {
            player.guessed = true
            io.to(player.room.ID).emit("receive-message", {
                type: "correct-guess",
                author: player.ID,
            })
            if (player.room.allGuessed()) {
                clearTimeout(player.room.timeout)
                player.room.timeout = undefined
                nextTurn(player.room, sendViewForAll)
                return
            }
            sendViewForAll()
        } else {
            io.to(player.room.ID).emit("receive-message", {
                type: "wrong-guess",
                author: player.ID,
                content,
            })
        }
    })

    socket.on("update-drawing", (drawing) => {
        if (!player.room) return
        if (player.room.drawer != player.ID) return
        player.room.drawing = drawing
        sendViewForAll()
    })

    socket.on("choose-word", (word) => {
        if (!player.room) return
        if (player.room.drawer != player.ID) return
        if (!player.room.wordChoices?.includes(word)) return
        player.room.word = word
        player.room.wordChoices = undefined
        player.room.waiting = false
        clearTimeout(player.room.timeout)
        player.room.timeout = undefined
        beginDrawing(player.room, sendViewForAll)
    })
})
