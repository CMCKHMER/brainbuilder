const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// HTTP Server for serving static files
const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code + ' ..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// WebSocket Server
const wss = new WebSocket.Server({ server });

// Game State Management
const rooms = new Map(); // roomId -> room data
const users = new Map(); // ws -> user data

// Room structure:
// {
//   id: string,
//   name: string,
//   teacherId: string,
//   assignment: object,
//   blocks: array,
//   chatHistory: array,
//   users: Map(ws -> user),
//   isLocked: boolean,
//   submissions: Map(userId -> submission)
// }

function generateId() {
    return Math.random().toString(36).substring(2, 15);
}

function broadcastToRoom(roomId, message, excludeWs = null) {
    const room = rooms.get(roomId);
    if (!room) return;
    
    room.users.forEach((user, ws) => {
        if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    });
}

function sendToUser(ws, message) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    }
}

wss.on('connection', (ws) => {
    console.log('New client connected');
    
    users.set(ws, {
        id: generateId(),
        name: null,
        role: null,
        roomId: null,
        color: '#' + Math.floor(Math.random()*16777215).toString(16)
    });

    ws.on('message', (data) => {
        try {
            const msg = JSON.parse(data);
            const user = users.get(ws);
            
            switch (msg.type) {
                case 'join':
                    handleJoin(ws, user, msg);
                    break;
                    
                case 'createRoom':
                    handleCreateRoom(ws, user, msg);
                    break;
                    
                case 'joinRoom':
                    handleJoinRoom(ws, user, msg);
                    break;
                    
                case 'leaveRoom':
                    handleLeaveRoom(ws, user);
                    break;
                    
                case 'blockPlace':
                    handleBlockPlace(ws, user, msg);
                    break;
                    
                case 'blockDelete':
                    handleBlockDelete(ws, user, msg);
                    break;
                    
                case 'blockPaint':
                    handleBlockPaint(ws, user, msg);
                    break;
                    
                case 'chat':
                    handleChat(ws, user, msg);
                    break;
                    
                case 'cursorMove':
                    handleCursorMove(ws, user, msg);
                    break;
                    
                case 'assignmentCreate':
                    handleAssignmentCreate(ws, user, msg);
                    break;
                    
                case 'assignmentSubmit':
                    handleAssignmentSubmit(ws, user, msg);
                    break;
                    
                case 'roomLock':
                    handleRoomLock(ws, user, msg);
                    break;
                    
                case 'clearRoom':
                    handleClearRoom(ws, user);
                    break;
                    
                case 'kickUser':
                    handleKickUser(ws, user, msg);
                    break;
                    
                case 'getRoomList':
                    handleGetRoomList(ws);
                    break;
                    
                case 'ping':
                    sendToUser(ws, { type: 'pong', timestamp: Date.now() });
                    break;
            }
        } catch (err) {
            console.error('Error handling message:', err);
        }
    });

    ws.on('close', () => {
        const user = users.get(ws);
        if (user && user.roomId) {
            handleLeaveRoom(ws, user);
        }
        users.delete(ws);
        console.log('Client disconnected');
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
});

function handleJoin(ws, user, msg) {
    user.name = msg.name || 'Anonymous';
    user.role = msg.role || 'student';
    
    sendToUser(ws, {
        type: 'joined',
        userId: user.id,
        color: user.color
    });
}

function handleCreateRoom(ws, user, msg) {
    if (user.role !== 'teacher') {
        sendToUser(ws, { type: 'error', message: 'Only teachers can create rooms' });
        return;
    }
    
    const roomId = generateId();
    const room = {
        id: roomId,
        name: msg.roomName || 'Untitled Project',
        teacherId: user.id,
        assignment: msg.assignment || null,
        blocks: [],
        chatHistory: [],
        users: new Map(),
        isLocked: false,
        submissions: new Map(),
        createdAt: Date.now()
    };
    
    rooms.set(roomId, room);
    
    // Auto-join the teacher
    joinRoom(ws, user, room);
    
    sendToUser(ws, {
        type: 'roomCreated',
        roomId: roomId,
        roomName: room.name
    });
    
    console.log(`Room created: ${roomId} by ${user.name}`);
}

function handleJoinRoom(ws, user, msg) {
    const room = rooms.get(msg.roomId);
    
    if (!room) {
        sendToUser(ws, { type: 'error', message: 'Room not found' });
        return;
    }
    
    if (room.isLocked && user.role !== 'teacher') {
        sendToUser(ws, { type: 'error', message: 'Room is locked' });
        return;
    }
    
    joinRoom(ws, user, room);
}

function joinRoom(ws, user, room) {
    // Leave current room if any
    if (user.roomId) {
        handleLeaveRoom(ws, user);
    }
    
    user.roomId = room.id;
    room.users.set(ws, user);
    
    // Send room state to new user
    sendToUser(ws, {
        type: 'roomJoined',
        roomId: room.id,
        roomName: room.name,
        assignment: room.assignment,
        blocks: room.blocks,
        chatHistory: room.chatHistory.slice(-50), // Last 50 messages
        users: Array.from(room.users.values()).map(u => ({
            id: u.id,
            name: u.name,
            role: u.role,
            color: u.color
        })),
        isLocked: room.isLocked
    });
    
    // Notify others
    broadcastToRoom(room.id, {
        type: 'userJoined',
        user: {
            id: user.id,
            name: user.name,
            role: user.role,
            color: user.color
        }
    }, ws);
    
    console.log(`${user.name} joined room ${room.id}`);
}

function handleLeaveRoom(ws, user) {
    if (!user.roomId) return;
    
    const room = rooms.get(user.roomId);
    if (room) {
        room.users.delete(ws);
        
        broadcastToRoom(room.id, {
            type: 'userLeft',
            userId: user.id,
            name: user.name
        });
        
        // If teacher leaves, assign new teacher or close room
        if (user.id === room.teacherId && room.users.size > 0) {
            const newTeacher = room.users.values().next().value;
            room.teacherId = newTeacher.id;
            broadcastToRoom(room.id, {
                type: 'newTeacher',
                userId: newTeacher.id,
                name: newTeacher.name
            });
        }
        
        // Clean up empty rooms after 5 minutes
        if (room.users.size === 0) {
            setTimeout(() => {
                if (room.users.size === 0) {
                    rooms.delete(room.id);
                    console.log(`Room ${room.id} deleted (empty)`);
                }
            }, 5 * 60 * 1000);
        }
    }
    
    user.roomId = null;
}

function handleBlockPlace(ws, user, msg) {
    const room = rooms.get(user.roomId);
    if (!room || room.isLocked) return;
    
    const blockData = {
        ...msg.block,
        id: generateId(),
        placedBy: user.id,
        placedAt: Date.now()
    };
    
    room.blocks.push(blockData);
    
    broadcastToRoom(room.id, {
        type: 'blockPlaced',
        block: blockData,
        by: user.name
    }, ws);
}

function handleBlockDelete(ws, user, msg) {
    const room = rooms.get(user.roomId);
    if (!room) return;
    
    // Only teacher or block owner can delete
    const blockIndex = room.blocks.findIndex(b => b.id === msg.blockId);
    if (blockIndex === -1) return;
    
    const block = room.blocks[blockIndex];
    if (user.role !== 'teacher' && block.placedBy !== user.id) {
        sendToUser(ws, { type: 'error', message: 'Can only delete your own blocks' });
        return;
    }
    
    room.blocks.splice(blockIndex, 1);
    
    broadcastToRoom(room.id, {
        type: 'blockDeleted',
        blockId: msg.blockId,
        by: user.name
    }, ws);
}

function handleBlockPaint(ws, user, msg) {
    const room = rooms.get(user.roomId);
    if (!room || room.isLocked) return;
    
    const block = room.blocks.find(b => b.id === msg.blockId);
    if (!block) return;
    
    block.color = msg.color;
    block.lastModifiedBy = user.id;
    block.lastModifiedAt = Date.now();
    
    broadcastToRoom(room.id, {
        type: 'blockPainted',
        blockId: msg.blockId,
        color: msg.color,
        by: user.name
    }, ws);
}

function handleChat(ws, user, msg) {
    const room = rooms.get(user.roomId);
    if (!room) return;
    
    const chatMsg = {
        id: generateId(),
        type: msg.messageType || 'text', // text, system, assignment
        content: msg.content,
        sender: {
            id: user.id,
            name: user.name,
            role: user.role,
            color: user.color
        },
        timestamp: Date.now()
    };
    
    room.chatHistory.push(chatMsg);
    
    // Keep only last 100 messages
    if (room.chatHistory.length > 100) {
        room.chatHistory.shift();
    }
    
    broadcastToRoom(room.id, {
        type: 'chatMessage',
        message: chatMsg
    });
}

function handleCursorMove(ws, user, msg) {
    const room = rooms.get(user.roomId);
    if (!room) return;
    
    broadcastToRoom(room.id, {
        type: 'cursorUpdate',
        userId: user.id,
        position: msg.position,
        name: user.name,
        color: user.color
    }, ws);
}

function handleAssignmentCreate(ws, user, msg) {
    const room = rooms.get(user.roomId);
    if (!room || user.id !== room.teacherId) return;
    
    room.assignment = {
        id: generateId(),
        title: msg.title,
        description: msg.description,
        dueDate: msg.dueDate,
        requirements: msg.requirements || [],
        createdAt: Date.now(),
        createdBy: user.id
    };
    
    // Add system message to chat
    const systemMsg = {
        id: generateId(),
        type: 'system',
        content: `📋 New assignment: "${msg.title}"`,
        timestamp: Date.now()
    };
    room.chatHistory.push(systemMsg);
    
    broadcastToRoom(room.id, {
        type: 'assignmentCreated',
        assignment: room.assignment,
        systemMessage: systemMsg
    });
}

function handleAssignmentSubmit(ws, user, msg) {
    const room = rooms.get(user.roomId);
    if (!room || user.role !== 'student') return;
    
    if (!room.assignment) {
        sendToUser(ws, { type: 'error', message: 'No active assignment' });
        return;
    }
    
    const submission = {
        userId: user.id,
        userName: user.name,
        submittedAt: Date.now(),
        blocks: room.blocks.filter(b => b.placedBy === user.id),
        comment: msg.comment || ''
    };
    
    room.submissions.set(user.id, submission);
    
    // Notify teacher
    room.users.forEach((u, clientWs) => {
        if (u.id === room.teacherId) {
            sendToUser(clientWs, {
                type: 'assignmentSubmitted',
                submission: submission
            });
        }
    });
    
    sendToUser(ws, { type: 'submitSuccess', message: 'Assignment submitted!' });
    
    // System message
    const systemMsg = {
        id: generateId(),
        type: 'system',
        content: `✅ ${user.name} submitted their assignment`,
        timestamp: Date.now()
    };
    room.chatHistory.push(systemMsg);
    broadcastToRoom(room.id, { type: 'chatMessage', message: systemMsg });
}

function handleRoomLock(ws, user, msg) {
    const room = rooms.get(user.roomId);
    if (!room || user.id !== room.teacherId) return;
    
    room.isLocked = msg.locked;
    
    broadcastToRoom(room.id, {
        type: 'roomLockChanged',
        locked: msg.locked,
        by: user.name
    });
    
    const systemMsg = {
        id: generateId(),
        type: 'system',
        content: msg.locked ? '🔒 Room locked by teacher' : '🔓 Room unlocked',
        timestamp: Date.now()
    };
    room.chatHistory.push(systemMsg);
    broadcastToRoom(room.id, { type: 'chatMessage', message: systemMsg });
}

function handleClearRoom(ws, user) {
    const room = rooms.get(user.roomId);
    if (!room || user.id !== room.teacherId) return;
    
    room.blocks = [];
    
    broadcastToRoom(room.id, {
        type: 'roomCleared',
        by: user.name
    });
    
    const systemMsg = {
        id: generateId(),
        type: 'system',
        content: '🗑️ Room cleared by teacher',
        timestamp: Date.now()
    };
    room.chatHistory.push(systemMsg);
    broadcastToRoom(room.id, { type: 'chatMessage', message: systemMsg });
}

function handleKickUser(ws, user, msg) {
    const room = rooms.get(user.roomId);
    if (!room || user.id !== room.teacherId) return;
    
    room.users.forEach((u, clientWs) => {
        if (u.id === msg.userId) {
            sendToUser(clientWs, {
                type: 'kicked',
                reason: msg.reason || 'Removed by teacher'
            });
            
            handleLeaveRoom(clientWs, u);
            clientWs.close();
        }
    });
}

function handleGetRoomList(ws) {
    const roomList = Array.from(rooms.values())
        .filter(r => !r.isLocked)
        .map(r => ({
            id: r.id,
            name: r.name,
            userCount: r.users.size,
            hasAssignment: !!r.assignment
        }));
    
    sendToUser(ws, {
        type: 'roomList',
        rooms: roomList
    });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 BrickForge Pro Server running on port ${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`🌐 Open http://localhost:${PORT} in your browser`);
});
