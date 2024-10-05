const User = require('../Models/user');
const Match = require('../Models/match');
const jwt = require('jsonwebtoken')
const socketConnection = (io) => {
    const games = {};
    io.use((socket, next) => {
        const token = socket.handshake.auth.token; 
        if (!token) {
            return next(new Error('Authentication error'));
        }
    
        try {
            // Verify JWT token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // Attach the decoded user to the socket
            next();
        } catch (err) {
            return next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log("New client connected");

        socket.on('createRoom', async (userId) => {
            const roomId = Math.random().toString(36).substring(7);
            const user = socket.user;
            // console.log("User", user);
            games[roomId] = {
                board: Array(9).fill(null),
                currentPlayer: 'X',
                players: [{ id: socket.id, userId: user.user, symbol: 'X' }]
            };
            socket.join(roomId);
            socket.emit('roomCreated', { roomId, playerId: socket.id, symbol: 'X' });
        });

        socket.on('joinRoom', async (roomId, userId) => {
            console.log(`Attempt to join room: ${roomId}`);
            if (!games[roomId]) {
                socket.emit('error', { message: 'Room does not exist' });
                return;
            }
            if (games[roomId].players.length >= 2) {
                socket.emit('error', { message: 'Room is full' });
                return;
            }
            const user = socket.user;
            const symbol = games[roomId].players[0].symbol === 'X' ? 'O' : 'X';
            games[roomId].players.push({ id: socket.id, userId: user.user, symbol });
            socket.join(roomId);
            socket.emit('gameJoined', { roomId, playerId: socket.id, symbol });
            io.to(roomId).emit('gameData', {
                board: games[roomId].board,
                currentPlayer: games[roomId].currentPlayer,
            });
        });

        socket.on('makeMove', async ({ roomId, index }) => {
            console.log("Move received", roomId, index);
            const game = games[roomId];
            if (game && !game.board[index] && game.players.length === 2) {
                const player = game.players.find(p => p.id === socket.id);
                if (player && player.symbol === game.currentPlayer) {
                    game.board[index] = player.symbol;
                    const winner = checkWinner(game.board);
                    console.log("Winner check result:", winner);
                    if (winner || game.board.every(cell => cell !== null)) {
                        io.to(roomId).emit('gameOver', { winner });
                        console.log(game);
                        await storeGameResult(game, winner);
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
    });

    const checkWinner = (board) => {
        const winCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let combination of winCombos) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        return null;
    }

    
    const storeGameResult = async (game, winner) => {
    try {
        const playerX = game.players.find(p => p.symbol === 'X');
        const playerO = game.players.find(p => p.symbol === 'O');

        console.log('Player X:', playerX);
        console.log('Player O:', playerO);

        if (!playerX || !playerO) {
            throw new Error('Players not found');
        }

        const match = new Match({
            playerX: playerX.userId,
            playerO: playerO.userId,
            winner: winner ? (winner === 'X' ? playerX.userId : playerO.userId) : null,
        });
        
        await match.save();

        const updatePlayerStats = async (userId, won) => {
            await User.findByIdAndUpdate(userId, {
                $inc: {
                    matchesPlayed: 1,
                    matchesWon: won ? 1 : 0,
                    matchesLost: won === false ? 1 : 0,
                    playerScore: won ? 3 : (winner ? 0 : 1)
                }
            });
        };

        await updatePlayerStats(playerX.userId, winner === 'X');
        await updatePlayerStats(playerO.userId, winner === 'O');

        console.log('Game result stored successfully');
    } catch (error) {
        console.error('Error storing game result:', error);
    }
};

};

module.exports = { socketConnection };