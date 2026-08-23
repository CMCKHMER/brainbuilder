# 🎓 BrickForge Pro - Teacher's Guide

Welcome to BrickForge Pro, the collaborative 3D building platform for education! This guide covers all features available to teachers.

---

## 🚀 Getting Started

### 1. Start the Server
```bash
# Double-click start-server.bat (Windows)
# Or run:
npm install
npm start
```

### 2. Access the Platform
Open your browser to `http://localhost:3000`

### 3. Login
- Enter your name
- Select **"Teacher"** role
- Click "Enter Platform"

---

## 🎨 Demo Mode (Solo Building)

As a teacher, you can enter **Demo Mode** directly from the lobby without creating a room. This is perfect for:

- **Preparing examples** before class
- **Testing new block types** and features
- **Creating demonstration builds**
- **Practicing with environments**

### Demo Mode Features:
- ✅ All building tools available
- ✅ Environment switching (8 different planets/terrains)
- ✅ Blueprint mode for technical visualization
- ✅ Save projects as JSON files
- ✅ Load saved projects later

### To Enter Demo Mode:
1. From the lobby, click **"Enter Demo Mode"** (purple button)
2. Build freely!
3. Click **"Save Project"** to export your creation
4. Click **"Exit Demo"** to return to lobby

---

## 🌍 Environment System

Teach about different planets and terrains! Switch environments to create authentic building scenarios.

### Available Environments:

| Key | Environment | Description | Use Case |
|-----|-------------|-------------|----------|
| 1 | 🌍 **Earth** | Standard gravity, blue sky | Normal building projects |
| 2 | 🔴 **Mars** | Red atmosphere, dusty | Space exploration lessons |
| 3 | 🌙 **Moon** | Low gravity, dark sky | Gravity/physics lessons |
| 4 | 🏜️ **Desert** | Bright sun, sandy | Ancient civilizations, Egypt |
| 5 | 🌴 **Jungle** | Dense fog, green tint | Rainforest ecosystems |
| 6 | 🏝️ **Island** | Clear water, tropical | Coastal architecture |
| 7 | ❄️ **Arctic** | Ice world, white ground | Climate study, igloos |
| 8 | 🌋 **Volcanic** | Dark, magma blocks | Geology, volcanic areas |

### How to Change Environment:
- Click **"🌍 Environment"** button in teacher controls
- Or press **number keys 1-8** for quick switching

---

## 📐 Blueprint Mode

Transform the view into a **technical blueprint visualization** - perfect for teaching construction and engineering concepts.

### Blueprint Mode Features:
- 🔷 Cyan-tinted visualization
- 📏 Grid overlay on screen
- 🔧 Technical aesthetic
- 📐 Construction planning focus

### How to Toggle:
- Click **"📐 Blueprint"** button
- Or press **Shift + B**

---

## 🧱 Block Categories

### Architecture (Basic Building)
- 🧱 Brick, 📐 Roof, ▦ Stair, 🪟 Window, 🚪 Door, 🚧 Fence

### Columns & Arches
- 🏛️ Column, ⛩️ Arch, 🔵 Round, ⬜ Slab

### Nature
- 🌳 Oak Tree, 🌲 Pine Tree, 🪨 Rock, 🌿 Shrub

### Terrain (NEW!)
- 🏖️ Sand - Build deserts and beaches
- 🟫 Sandstone - Ancient structures
- 🟤 Dirt with grass - Natural terrain
- 🧱 Clay - Pottery, bricks

### Construction (NEW!)
- 🏗️ Concrete with rebar - Modern buildings
- ⬜ Concrete Slab - Foundations
- 🏭 I-Beam Steel - Industrial structures
- 🔩 Metal Plate - Mechanical parts

### Extreme Elements (NEW!)
- 🧊 Ice - Arctic builds, frozen scenes
- ❄️ Snow - Winter environments
- 🔥 Magma - Volcanic, glowing hot
- ⬛ Obsidian - Dark volcanic glass

### Lighting (NEW!)
- 🟣 Neon Strip - Cyberpunk, modern lighting
- 💡 Light Block - Interior lighting
- 🌋 Lava - Natural light source

---

## 👥 Creating a Classroom Room

### Step 1: Create Room
1. In lobby, fill in:
   - **Project Name** (e.g., "Ancient Egypt Study")
   - **Assignment Title** (e.g., "Build a pyramid with a tomb")
   - **Description** (detailed instructions)

2. Click **"Create Project Room"**

### Step 2: Students Join
Share the Room ID (shown in URL) with students, or have them click your room from the list.

### Step 3: Manage the Session

#### Teacher Controls:
- 📋 **Assignment** - View/edit assignment details
- 🔒 **Lock/Unlock Room** - Control when students can build
- 🌍 **Environment** - Change planet/terrain
- 📐 **Blueprint** - Toggle blueprint visualization
- 🗑️ **Clear All** - Remove all blocks (use with caution!)
- ← **Leave Room** - Exit to lobby

#### Student Controls:
- 📤 **Submit Work** - Students submit their assignment
- 📋 **View Assignment** - See instructions
- ← **Leave** - Exit to lobby

---

## 💾 Importing Demo Projects to Classroom

1. **In Demo Mode:** Build your example/starting structure
2. Click **"Save Project"** - Downloads as JSON
3. **Back in Lobby:** Create or join a room
4. Use the regular **"Load Build"** button to import the JSON
5. Students now see your pre-built structure!

---

## 🌦️ Additional Features

### Weather System (W key)
- 🌧️ Rain - Falls straight down
- ❄️ Snow - Falls slowly with drift
- Double-click weather button to switch between rain/snow

### Day/Night Cycle
- Drag the vertical slider (right side) to change time
- Affects lighting, sky color, shadows

### Time of Day Slider
- 0-24 hour control
- Dawn, day, dusk, night phases
- Different sun positions and colors

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| 1-8 | Switch environment (Earth, Mars, Moon, etc.) |
| B / Space | Place block |
| Shift+B | Toggle blueprint mode |
| R | Rotate block |
| T/E/P/S | Tools (Build/Erase/Paint/Select) |
| W | Toggle weather |
| G | Toggle grid |
| X | Toggle snap |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| H | Toggle help |
| Tab | Toggle UI |

---

## 📚 Lesson Ideas

### History
- **Ancient Egypt:** Use Desert environment, Sandstone blocks
- **Roman Architecture:** Columns, arches on Earth
- **Mayan Temples:** Jungle environment, stone blocks

### Science
- **Solar System:** Build on different planets (Mars, Moon)
- **Gravity:** Compare builds on Earth vs Moon
- **Climate:** Build appropriate structures in Arctic vs Desert

### Engineering
- **Bridge Building:** Use I-Beams, concrete
- **Architecture:** Blueprint mode for technical drawing
- **Materials Science:** Test different block materials

### Art & Design
- **Color Theory:** Paint blocks, coordinate palettes
- **Sculpture:** Use nature blocks for organic shapes
- **Light Design:** Neon strips, light blocks for mood

---

## 🔒 Safety & Control

### Room Locking
- Lock the room during instruction
- Students can only watch, not build
- Unlock when ready for activity

### Clearing Room
- Removes ALL blocks permanently
- Use with caution!
- Good for fresh starts between classes

### Block Ownership
- Students can only delete their own blocks
- Teachers can delete any block
- Block owner shown on hover (future feature)

---

## 🐛 Troubleshooting

### "Room not found"
- Room ID may have been mistyped
- Room may have been deleted (empty for 5+ minutes)

### "Can't place blocks"
- Room may be locked by teacher
- Check if you're in the correct tool mode (T for build)

### Students can't see my blocks
- Check connection status (top right)
- Try refreshing the page
- Ensure all students are in the same room

### Environment not changing
- Click the "🌍 Environment" button
- Or use number keys 1-8
- Some visual changes may be subtle

---

## 💡 Tips for Success

1. **Start in Demo Mode** - Build an example before class
2. **Use Blueprint Mode** - For technical/engineering lessons
3. **Switch Environments** - Make lessons more immersive
4. **Lock Room First** - Give instructions before building starts
5. **Save Demo Projects** - Reuse good examples across classes
6. **Assign Roles** - Let students specialize (architect, builder, designer)
7. **Use Chat** - Encourage communication and teamwork
8. **Screenshot Results** - Document student work with 📸 button

---

## 📞 Support

For technical issues or feature requests:
- Check the README.md
- Review code on GitHub
- Contact your IT administrator

---

**Happy Building! 🧱✨**

*Remember: The best learning happens when students are engaged and creative. Let them experiment!*
