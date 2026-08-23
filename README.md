# 🧱 BrickForge Pro - Educational Platform

A collaborative 3D building platform designed for schools to facilitate digital building projects and team-based learning.

## 🚀 Quick Start

### For Teachers

1. **Start the Server**
   ```bash
   npm install
   npm start
   ```

2. **Open Browser**
   Navigate to `http://localhost:3000`

3. **Login as Teacher**
   - Enter your name
   - Select "Teacher" role
   - Click "Enter Platform"

4. **Create a Project**
   - Click "Create New Project"
   - Enter project name and assignment details
   - Share the Room ID with students

5. **Monitor and Guide**
   - Lock/unlock the room to control editing
   - View student progress in real-time
   - Chat with students
   - Review submissions

### For Students

1. **Join the Platform**
   - Enter your name
   - Select "Student" role
   - Click "Enter Platform"

2. **Join a Room**
   - Click on a project from the list, OR
   - Enter the Room ID provided by your teacher
   - Click "Join"

3. **Build Together**
   - Place blocks to build your project
   - Chat with teammates
   - See everyone's cursor positions
   - Submit your work when done

## ✨ Features

### 🎓 Educational Features

- **Assignment System**: Teachers can create assignments with descriptions and requirements
- **Real-time Collaboration**: Multiple students can build together simultaneously
- **Progress Monitoring**: Teachers can watch student progress in real-time
- **Submission System**: Students submit their work with comments
- **Room Locking**: Teachers can lock rooms to prevent changes during instruction

### 💬 Communication

- **Team Chat**: Built-in chat for team coordination
- **User Presence**: See who's online and their role
- **Remote Cursors**: See where teammates are looking/pointing
- **System Messages**: Automatic notifications for joins, leaves, and actions

### 🎮 Building Features

- **20+ Block Types**: Bricks, slopes, trees, windows, doors, and more
- **Multiplayer Sync**: All block changes sync instantly
- **Undo/Redo**: Full history support (Ctrl+Z / Ctrl+Y)
- **Color Palette**: 24 colors for customization
- **3D Model Import**: Support for .glb, .gltf, and .obj files

### 🎨 Environment

- **Day/Night Cycle**: Adjustable time of day
- **Weather Effects**: Rain and snow
- **Themes**: Dark and light mode
- **Auto-rotate Camera**: For presentations

### 💾 Save & Share

- **Export Build**: Save your creation as JSON
- **Import Build**: Load previous saves
- **Screenshots**: Capture your work as PNG

## 🖥️ System Requirements

- **Node.js** 14+ (for server)
- **Modern Web Browser** with WebGL support
- **Network**: All users must be on the same network or server must be publicly accessible

## 🌐 Deployment for Schools

### Local Network (Classroom)

1. Run the server on a classroom computer
2. Find the server's IP address: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Students access via: `http://[SERVER_IP]:3000`

### Cloud Deployment

For remote learning, deploy to:
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **AWS/GCP**: Use EC2/Compute Engine
- **Vercel**: Not recommended (needs WebSocket support)

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
```

```bash
docker build -t brickforge-pro .
docker run -p 8080:8080 brickforge-pro
```

## 📋 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| B / Space | Place block |
| R | Rotate block |
| T | Build tool |
| E | Erase tool |
| P | Paint tool |
| S | Select tool |
| W | Toggle weather |
| A | Auto-rotate camera |
| G | Toggle grid |
| X | Toggle snap |
| H | Toggle help |
| Tab | Toggle UI |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Ctrl+D | Duplicate selected |
| Delete | Delete selected |

## 🏗️ Project Structure

```
BrickForgePro/
├── index.html          # Main client application
├── server.js           # WebSocket server
├── package.json        # Dependencies
├── README.md          # This file
└── .gitignore         # Git ignore rules
```

## 🔒 Security Considerations

- **No Authentication**: Current version uses simple name-based identification
- **Room Isolation**: Each room is separate; users can't access other rooms
- **Teacher Controls**: Only teachers can create rooms, lock rooms, clear blocks
- **No Persistence**: Rooms are deleted 5 minutes after all users leave

## 🐛 Troubleshooting

### Connection Issues
- Check firewall settings (port 8080)
- Verify all users are on the same network
- Check browser console for errors

### WebGL Not Working
- Update graphics drivers
- Enable hardware acceleration in browser
- Try a different browser (Chrome recommended)

### Port Already in Use
The default port is 3000. To use a different port:
```bash
PORT=8080 npm start  # Unix/Mac
set PORT=8080 && npm start  # Windows
```

## 🤝 Contributing

This is an educational open-source project. Contributions welcome!

### Ideas for Enhancement
- [ ] User accounts and authentication
- [ ] Persistent room storage (database)
- [ ] Project templates
- [ ] Grading/rubric system
- [ ] Screen sharing for teachers
- [ ] Audio chat
- [ ] Mobile app
- [ ] VR support

## 📜 License

MIT License - Free for educational use

## 🙏 Credits

- **Three.js** - 3D rendering
- **WebSocket** - Real-time communication
- **Tailwind CSS** - Styling

---

**Built for educators who want to bring creativity into the classroom.** 🎓✨
