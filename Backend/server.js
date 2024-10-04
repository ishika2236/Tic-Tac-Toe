const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const UserRoutes = require('./Routes/user')
const MatchRoutes = require('./Routes/match')
require('dotenv').config();
const app = express();
const server = http.createServer(app);
app.use(cors({
    origin: 'http://localhost:5173', // Assuming your React app runs on port 5173
    methods: ['GET', 'POST'],
    credentials: true,
  }));
  
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });
app.use(express.json());
app.use('/api/auth',UserRoutes);
app.use('/api/match',MatchRoutes);


const games = {};

io.on('connection', (socket) =>{
    console.log("New client connected");

    socket.on('createRoom', () => {
        const roomId = Math.random().toString(36).substring(7);
        games[roomId] = {
            board: Array(9).fill(null),
            currentPlayer: 'X',
            players: [{ id: socket.id, symbol: 'X' }]
        };
        socket.join(roomId);
        socket.emit('roomCreated', { roomId, playerId: socket.id, symbol: 'X' });
    });

    socket.on('joinRoom', (roomId) => {
        console.log(`Attempt to join room: ${roomId}`);
        if (!games[roomId]) {
            socket.emit('error', { message: 'Room does not exist' });
            return;
        }
        if (games[roomId].players.length >= 2) {
            socket.emit('error', { message: 'Room is full' });
            return;
        }

        const symbol = games[roomId].players[0].symbol === 'X' ? 'O' : 'X';
        games[roomId].players.push({ id: socket.id, symbol });
        socket.join(roomId);
        socket.emit('gameJoined', { roomId, playerId: socket.id, symbol });
        io.to(roomId).emit('gameData', {
            board: games[roomId].board,
            currentPlayer: games[roomId].currentPlayer,
        });
    });
    
    socket.on('makeMove', ({ roomId, index }) => {
        console.log("Move received", roomId, index);
        const game = games[roomId];
        if (game && !game.board[index] && game.players.length === 2) {
            const player = game.players.find(p => p.id === socket.id);
            if (player && player.symbol === game.currentPlayer) {
                game.board[index] = player.symbol;
                const winner = checkWinner(game.board);
                console.log(winner);
                if (winner) {
                    io.to(roomId).emit('gameOver', { winner });
                    delete games[roomId];
                } else {
                    game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
                    io.to(roomId).emit('gameData', {
                        board: game.board,
                        currentPlayer: game.currentPlayer,
                    });
                }
            }
        }
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
        for (const roomId in games) {
            const game = games[roomId];
            const playerIndex = game.players.findIndex(p => p.id === socket.id);
            if (playerIndex !== -1) {
                game.players.splice(playerIndex, 1);
                if (game.players.length === 0) {
                    delete games[roomId];
                } else {
                    io.to(roomId).emit('playerLeft', { playerId: socket.id });
                }
            }
        }
    });
})
const checkWinner = (board) =>{
    const wincombos = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];
    for(let combination of wincombos)
    {
        const [a,b,c]= combination;
        if(board[a] && board[a] === board[b] && board[c])
        {
            return board[a];
        }
        if (board.every(cell => cell !== null)) {
            return 'draw';
        }
        return null;
    }
}

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true, useUnifiedTopology: true})
.then(() => {
    server.listen(5000, ()=>{
        console.log('Server is running on port 5000');
    })
})
.catch(err => console.log(err));