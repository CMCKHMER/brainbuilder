# BrickForge Pro — Building Game for Education

A real-time multiplayer 3D building platform designed for classrooms. Teachers create rooms, set assignments, and monitor student progress; students collaborate to build structures using a rich set of block types and tools.

---

## Features

- **Real-time multiplayer** — multiple users in the same room see each other's changes instantly via WebSockets
- **Roles** — Teacher, Student, and Observer modes with different permission levels
- **Assignment system** — teachers create and publish assignments; students submit completed builds for review
- **Room management** — room codes for easy joining, room locking to prevent late entries
- **Team chat** — in-app messaging between all room participants
- **User presence & remote cursors** — see who is online and where others are pointing
- **20+ block types** — standard, glass, wood, brick, stone, metal, and more
- **Color palette** — full per-block coloring
- **Undo / Redo** — full history stack per session
- **Day/night cycle & weather effects** — visual environment controls
- **Export / Import builds** — save and load scenes as JSON
- **PNG screenshots** — one-click capture of the current view
- **Keyboard shortcuts** — power-user workflow support

---

## Quick Start

\`\`\`bash
npm install
npm start
\`\`\`

The server listens on \`process.env.PORT\` or **5000** by default.
Open **http://localhost:5000** in your browser.

> **Windows users:** double-click \`start-server.bat\` to launch the server.
> Make sure the \`.bat\` file references port **5000** (edit it if it still says 3000).

---

## Teacher Guide

1. Open the app and choose **Create Room**.
2. Share the generated **room code** with your students.
3. Use **Set Assignment** to publish a build prompt or objective.
4. Monitor progress in real time; use **Lock Room** to prevent new joins when ready.
5. When done, use **Export Progress** (JSON) to save all student builds.

---

## Student Guide

1. Open the app and choose **Join Room**.
2. Enter the room code provided by your teacher.
3. Build your structure using the block palette, color picker, and toolbar.
4. Use **Chat** to communicate with teammates.
5. Click **Submit Work** when your build is complete.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| \`W\` / \`A\` / \`S\` / \`D\` | Move camera |
| \`Q\` / \`E\` | Move camera up / down |
| \`Ctrl + Z\` | Undo |
| \`Ctrl + Y\` / \`Ctrl + Shift + Z\` | Redo |
| \`Delete\` | Remove selected block |
| \`G\` | Toggle grid |
| \`N\` | Toggle day/night |
| \`P\` | Take PNG screenshot |
| \`Esc\` | Deselect / close panel |

---

## Project Structure

\`\`\`
brainbuilder/
├── index.html          # Single-file client app (Three.js + Tailwind)
├── server.js           # Node.js HTTP + WebSocket server (ws)
├── package.json        # npm config; only production dependency: ws
├── package-lock.json   # Lockfile
├── start-server.bat    # Windows convenience launcher
├── .gitignore
├── README.md
├── LICENSE
└── COPYRIGHT.md
\`\`\`

---

## Deployment

### Local classroom network
Run \`npm start\` on the teacher's machine. Students connect via the machine's LAN IP, e.g. \`http://192.168.1.10:5000\`.

### Cloud (Heroku / Railway)
Both platforms expose a \`PORT\` environment variable automatically. The server already reads \`process.env.PORT\`, so no code changes are needed. Push the repo (without \`node_modules/\`) and the platform will run \`npm install && npm start\`.

### Docker

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
\`\`\`

Build and run:

\`\`\`bash
docker build -t brickforge-pro .
docker run -p 5000:5000 brickforge-pro
\`\`\`

---

## Security Considerations

- **No authentication** — anyone with the room code can join. Use unique codes per session.
- **Room isolation** — rooms are independent; one room cannot read another's data.
- **No persistence** — all room data is held in memory. Rooms are deleted **5 minutes** after the last user leaves. Export builds before closing.
- For production use, consider adding authentication and a persistent data store.

---

## License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for full text.
Copyright and usage rules are detailed in [COPYRIGHT.md](COPYRIGHT.md).
