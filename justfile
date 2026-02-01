fmt:
    bunx --bun prettier -uwu .

fe:
    bun --filter=frontend vite --host

be:
    bun --filter=backend dev
