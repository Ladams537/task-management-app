// Import necessary packages using ES module syntax
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import 'dotenv/config';

// Import the router for board-related endpoints
import dashboardRoutes from './routes/dashoard.js';
import boardRoutes from './routes/board.js';
import taskRoutes from './routes/task.js';
import { query } from './db/index.js';


// --- Initial Setup ---
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow requests from our SvelteKit frontend
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// Test the database connection on startup
query('SELECT NOW()', [])
    .then(() => console.log('Successfully connected to PostgreSQL database!'))
    .catch(err => console.error('Database connection error', err.stack));


// --- Middleware ---
app.use(cors()); 
app.use(express.json());

// Make the `io` instance available to all route handlers
app.use((req, res, next) => {
    req.io = io;
    next();
});


// --- Routes ---
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/board/:boardId', boardRoutes);
app.use('/api/list/:listId', taskRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Task Management API!' });
});


// --- Socket.io Connection ---
io.on('connection', (socket) => {
    console.log(`A user connected with socket id: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`User with socket id: ${socket.id} disconnected`);
    });
});


// --- Start Server ---
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
