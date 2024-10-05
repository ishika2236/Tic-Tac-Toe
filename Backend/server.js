const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const UserRoutes = require('./Routes/user');
const ProfileRoutes = require('./Routes/profile');
const { socketConnection } = require('./Controllers/socket');
const {authMiddleware} = require('./Middleware/auth');
require('dotenv').config();
const verifyToken = require('./Middleware/verify-token')

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Assuming your React app runs on port 5173
    methods: ['GET', 'POST'],
    credentials: true,
}));
app.use(express.json());

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
socketConnection(io);

// Routes
app.use('/api/auth', UserRoutes);

// Profile route
app.use('/api/profile',verifyToken, ProfileRoutes);

// Database connection and server start
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    server.listen(5000, () => {
        console.log('Server is running on port 5000');
    });
})
.catch(err => {
    console.error('Database connection error:', err);
});