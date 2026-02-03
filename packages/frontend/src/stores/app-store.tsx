import {create} from "zustand"
import {immer} from "zustand/middleware/immer"
import type {Message} from "../../../backend/src/protocol.ts"
import type {View} from "../../../backend/src/view.ts"

export interface AppState {
    view: View
    messages: Message[]
}

export interface AppActions {
    setView: (view: View) => void
    clearMessages: () => void
    addMessage: (message: Message) => void
}

export const useAppStore = create<AppState & AppActions>()(
    immer((set) => ({
        view: {view: "menu", playerID: "", cosmetics: null},
        messages: [],

        setView: (view: View) => {
            set((state) => {
                state.view = view
            })
        },
        clearMessages: () => {
            set((state) => {
                state.messages = []
            })
        },
        addMessage: (message: Message) => {
            set((state) => {
                state.messages.push(message)
            })
        },
    })),
)
