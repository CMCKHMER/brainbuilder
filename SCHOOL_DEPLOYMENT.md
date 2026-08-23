# BrickForge Pro - School Deployment Guide

## Quick Start for Teachers

### System Requirements
- **Windows**: Windows 10/11, 4GB RAM, OpenGL 3.3 compatible GPU
- **Mac**: macOS 10.15+, 4GB RAM
- **Linux**: Ubuntu 20.04+ or equivalent

### Installation Options

#### Option 1: Godot Editor (Recommended for IT/CS Classes)
1. Download Godot 4.x from https://godotengine.org
2. Copy the `brick-forge-pro` folder to student computers
3. Open `project.godot` in Godot
4. Press F5 to run

**Benefits:**
- Students can view/modify code
- Teaches GDScript programming
- Full access to all features

#### Option 2: Exported Executable (Easiest for Students)
1. In Godot: Project → Export
2. Choose platform (Windows/Mac/Linux)
3. Export to folder
4. Distribute executable to students

**Benefits:**
- No installation needed
- Students can't accidentally break code
- Runs with double-click

#### Option 3: Web Export (Chromebooks)
1. In Godot: Project → Export → Web
2. Export to HTML5
3. Host on school web server or run locally

---

## Features Overview

### 50+ Block Types (Organized in 5 Tabs)

| Tab | Blocks | Use Case |
|-----|--------|----------|
| **Blocks** | Cube, Slope, Wedge, Cylinder, Sphere, Arch, Corner, Plate, Stair, Tube | Basic building shapes |
| **Arch** | Wall, Window, Door, Fence, Pillar, Beam, Brick, Panel, Floor, Gate | Architecture & structures |
| **Nature** | Oak Tree, Pine Tree, Palm Tree, Rock, Boulder, Bush, Shrub, Flower, Cactus, Mushroom | Outdoor scenes |
| **Mat** | Wood, Plank, Stone, Cobblestone, Marble, Concrete, Sand, Dirt, Clay, Leaves | Material blocks |
| **FX** | Metal, Steel, Gold, Copper, Glass, Neon, Glow, Water, Lava, Ice, Snow | Special effects |

### Tools
- **Build (1)** - Place blocks
- **Paint (2)** - Change block colors
- **Erase (3)** - Remove blocks  
- **Select (4)** - Select and delete blocks

### Controls
| Key | Action |
|-----|--------|
| Left Click | Use current tool |
| Right Click + Drag | Pan camera |
| Middle Click + Drag | Rotate camera |
| Scroll | Zoom in/out |
| R | Rotate block |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| G | Toggle grid |
| 1-4 | Switch tools |
| F1 | Show help |

---

## Lesson Ideas

### Beginner (Ages 8-12)
1. **Build a House** - Use walls, windows, doors
2. **Create a Garden** - Add trees, rocks, flowers
3. **Build a Bridge** - Use arches and plates

### Intermediate (Ages 12-15)
1. **Recreate Landmarks** - Eiffel Tower, pyramids, castles
2. **Design a Park** - Combine nature + architecture
3. **Theme Worlds** - Mars base, underwater city, treehouse

### Advanced (Ages 15+)
1. **Modify the Code** - Add new block types
2. **Export & Share** - Save builds as JSON
3. **Multiplayer Setup** - Use network manager

---

## File Structure

```
brick-forge-pro/
├── project.godot          # Project settings
├── main.tscn             # Main scene (UI + 3D)
├── main.gd               # Game logic (50+ blocks)
├── ui_manager.gd         # UI controller
├── camera_controller.gd  # Camera movement
├── network_manager.gd    # Multiplayer (optional)
└── icon.svg              # App icon
```

---

## Troubleshooting

### "No renderer found" error
- Update graphics drivers
- Check OpenGL 3.3 support

### Black screen
- Check WorldEnvironment node exists
- Verify Camera3D has `current = true`

### Can't place blocks
- Make sure Build tool is selected (press 1)
- Check if mouse is over ground

### Slow performance
- Reduce block count (clear with Clear button)
- Lower graphics settings in Project Settings

---

## Customization

### Adding New Blocks
Edit `main.gd`:
```gdscript
enum BlockType {
    # ... existing blocks ...
    MY_NEW_BLOCK  # Add this
}

const BLOCK_DATA = {
    # ... existing data ...
    BlockType.MY_NEW_BLOCK: {
        "name": "My Block",
        "cat": BlockCategory.BASIC,
        "height": 1.0
    }
}
```

Then add the mesh creation in `create_block_mesh()`.

### Changing Default Colors
Edit `COLOR_PALETTE` array in `main.gd`.

### Adding New Environments
Add to `ENVIRONMENTS` dictionary in `main.gd`.

---

## Export for Distribution

### Windows (.exe)
1. Download export templates from Godot
2. Project → Export → Add → Windows Desktop
3. Export Project → Choose folder
4. Distribute the .exe and .pck files

### Mac (.app)
1. Project → Export → Add → macOS
2. Export Project
3. Distribute the .app bundle

### Linux
1. Project → Export → Add → Linux
2. Export Project
3. Distribute the executable

---

## License & Credits

- Built with Godot Engine (MIT License)
- Free for educational use
- Students can modify and share

---

## Support

For issues or questions:
1. Check the Help panel in-game (F1)
2. Review the code comments in main.gd
3. Consult Godot documentation: docs.godotengine.org
