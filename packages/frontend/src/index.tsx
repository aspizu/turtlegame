import "@/styles/global.css"
import {StrictMode} from "react"
import {createRoot} from "react-dom/client"
import App from "./features/app"

// @ts-expect-error foo
import "@fontsource-variable/figtree"
// @ts-expect-error foo
import "@fontsource-variable/fira-code"

if (typeof Node === "function" && Node.prototype) {
    const originalRemoveChild = Node.prototype.removeChild
    // @ts-expect-error foo
    Node.prototype.removeChild = function (child) {
        try {
            // @ts-expect-error foo
            // eslint-disable-next-line prefer-rest-params
            return originalRemoveChild.apply(this, arguments)
        } catch (e) {
            console.error("Error in removeChild:", e, child, this)
        }
    }
}

if (typeof Node === "function" && Node.prototype) {
    const originalAppendChild = Node.prototype.appendChild
    // @ts-expect-error foo
    Node.prototype.appendChild = function (child) {
        try {
            // @ts-expect-error foo
            // eslint-disable-next-line prefer-rest-params
            return originalAppendChild.apply(this, arguments)
        } catch (e) {
            console.error("Error in appendChild", e, child, this)
        }
    }
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
