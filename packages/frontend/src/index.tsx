import "@/styles/global.css"
import {StrictMode} from "react"
import {createRoot} from "react-dom/client"

// @ts-ignore
import "@fontsource-variable/figtree"
// @ts-ignore
import "@fontsource-variable/fira-code"
import App from "./features/app"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
