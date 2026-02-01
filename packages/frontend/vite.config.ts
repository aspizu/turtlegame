import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "path"
import {defineConfig, loadEnv} from "vite"

export default ({mode}: {mode: string}) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())}
    return defineConfig({
        build: {target: "esnext"},
        plugins: [react(), tailwindcss()],
        server: {
            proxy: {
                "/socket.io": {
                    target: `ws://${process.env.VITE_SOCKET}`,
                    changeOrigin: true,
                    ws: true,
                },
            },
        },
        resolve: {alias: {"@": path.resolve(__dirname, "./src")}},
    })
}
