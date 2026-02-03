# Skriptl

> Create an issue if you would like this to be deployed online and developed further!

Skribbl clone where you live-code p5.js sketches instead of drawing by hand. Built with TypeScript, React, and Socket.IO.

<p align="center">
  <img src="https://media.discordapp.net/attachments/688726629509496846/1468222754565132390/image.png?ex=69833c7e&is=6981eafe&hm=c9c0bef9a4f342c3683c6c2b131542c0bb686a5d589d069eeffd9aeb630b9c87&=&format=webp&quality=lossless&width=1904&height=1190" alt="Turtle Game Screenshot">
</p>

## Features

- Real-time multiplayer with Socket.IO
- Turn-based gameplay, 5 rounds per game
- p5.js drawing canvas
- Live chat and guessing
- Choose from 3 words per turn
- 25-second rounds with countdown
- Progressive hints
- Time-based scoring
- shadcn/ui + Tailwind CSS

## Tech Stack

### Frontend

- React 19 + TypeScript
- Vite
- Zustand (state)
- p5.js (canvas)
- Socket.IO Client
- shadcn/ui + Radix UI
- Tailwind CSS
- date-fns

### Backend

- Bun runtime
- Socket.IO
- TypeScript
- date-fns

## Prerequisites

- [Bun](https://bun.sh/) v1.0+

## Installation

Clone and install:

```bash
git clone <repository-url>
cd turtlegame
bun install
```

## Development

Monorepo with separate frontend and backend packages.

```bash
# Start frontend (http://localhost:5173)
just fe

# Start backend (separate terminal)
just be
```

Or run directly:

```bash
bun --filter=frontend vite --host
bun --filter=backend dev
```

## Project Structure

```
turtlegame/
├── packages/
│   ├── backend/          # Game server
│   │   └── src/
│   │       ├── index.ts       # Server entry point
│   │       ├── game.ts        # Core game logic
│   │       ├── player.ts      # Player management
│   │       ├── room.ts        # Room management
│   │       ├── socket.ts      # Socket.IO setup
│   │       ├── view.ts        # View generation
│   │       ├── protocol.ts    # Communication protocol
│   │       └── words.json     # Word database
│   └── frontend/         # React application
│       └── src/
│           ├── components/    # Reusable UI components
│           ├── features/      # Feature-specific components
│           ├── pages/         # Page components
│           ├── stores/        # Zustand stores
│           ├── services/      # External services (socket)
│           └── hooks/         # Custom React hooks
└── justfile              # Task runner commands
```

## How to Play

1. Join or create a room
2. Wait for players to ready up
3. Drawer picks from 3 words, writes p5.js sketch (25s)
4. Guessers type in chat (faster = more points)
5. Play 5 rounds

## Game Rules

- 5 rounds per game
- Everyone draws once per round
- 5s to pick word, 25s to draw
- Points scale with guess speed
- Drawer earns points when others guess

## Scripts

### Root Level

```bash
# Format all code with Prettier
just fmt

# Run PR workflow
just pr-workflow <branch-name> <commit-message>
```

### Frontend

```bash
# Run linter
bun --filter=frontend lint

# Fix linting issues
bun --filter=frontend lint:fix
```

## Code Style

- **State Management**: Use Zustand for global state, useState for local state
- **UI Components**: Prefer shadcn/ui components when available
- **Formatting**: Prettier with Tailwind CSS plugin
- **Linting**: ESLint for code quality

## Architecture

### Backend

- Event-driven Socket.IO
- Room-based isolation
- Server generates view state per player
- State updates broadcast to room

### Frontend

- Modular React components
- Socket.IO maintains connection
- Zustand for reactive state
- Custom hooks: `use-clock`, `use-diff`

## Configuration

Backend: port 3000 (see `index.ts`)
Frontend: port 5173 (see `vite.config.ts`)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and formatting: `just fmt`
4. Test your changes locally
5. Submit a pull request

## Future Enhancements

- [ ] Custom word lists
- [ ] Private rooms with passwords
- [ ] Drawing tools expansion (colors, brush sizes, eraser)
- [ ] Replay system
- [ ] Player profiles and statistics
- [ ] Multiple language support
- [ ] Mobile-responsive design improvements

## Troubleshooting

**Connection issues**: Check both services running, ports 3000/5173 free, Socket.IO connected in console.

**Build issues**: Clear node_modules and reinstall, update Bun.

```bash
rm -rf node_modules packages/*/node_modules
bun install
bun upgrade
```

## License

This project is open source and available for personal and educational use.

## Acknowledgments

- Built with [Bun](https://bun.sh/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Drawing powered by [p5.js](https://p5js.org/)
- Real-time communication via [Socket.IO](https://socket.io/)
