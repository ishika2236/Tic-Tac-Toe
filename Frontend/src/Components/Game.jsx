import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Game.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const token = localStorage.getItem('token');
let socket;

const Game = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [winner, setWinner] = useState(null);
    const [roomId, setRoomId] = useState('');
    const [playerId, setPlayerId] = useState('');
    const [playerSymbol, setPlayerSymbol] = useState('');
    const [message, setMessage] = useState('');
    const [gameStarted, setGameStarted] = useState(false);
    const [showLoginAlert, setShowLoginAlert] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        if (!token) {
            setShowLoginAlert(true); // Show alert if user is not logged in
            return;
        }

        // Initialize socket connection if token is present
        socket = io('http://localhost:5000', {
            auth: { token }
        });

        socket.on('roomCreated', ({ roomId, playerId, symbol }) => {
            setRoomId(roomId);
            setPlayerId(playerId);
            setPlayerSymbol(symbol);
            setMessage('Waiting for opponent...');
        });

        socket.on('gameJoined', ({ roomId, playerId, symbol }) => {
            setRoomId(roomId);
            setPlayerId(playerId);
            setPlayerSymbol(symbol);
            setMessage(`Joined room ${roomId}.`);
            setGameStarted(true);
        });

        socket.on('gameData', ({ board, currentPlayer }) => {
            setBoard(board);
            setCurrentPlayer(currentPlayer);
            setGameStarted(true);
        });

        socket.on('gameOver', ({ winner }) => {
            setWinner(winner);
            setMessage(winner === 'draw' ? "It's a draw!" : `Winner: ${winner}`);
            setGameStarted(false);
        });

        socket.on('error', ({ message }) => {
            setMessage(message);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const createRoom = (e) => {
        e.preventDefault();
        socket.emit('createRoom');
    };

    const joinRoom = () => {
        if (roomId) {
            socket.emit('joinRoom', roomId);
            setOpenDialog(false); // Close the dialog after joining the room
        }
    };

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleClick = (index) => {
        if (!board[index] && !winner && currentPlayer === playerSymbol) {
            socket.emit('makeMove', { roomId, index });
        }
    };

    const renderBoard = () => (
        <div className="board">
            {board.map((cell, index) => (
                <button 
                    key={index} 
                    onClick={() => handleClick(index)} 
                    disabled={!gameStarted || currentPlayer !== playerSymbol || winner}
                    className="cell"
                >
                    {cell}
                </button>
            ))}
        </div>
    );

    return (
        <div className="card game-container">
            <h2>PLAY!!</h2>
            {showLoginAlert && (
                <div className="alert">
                    <p>You need to log in first to play the game.</p>
                    <button className="gradient-button" onClick={() => window.location.href = '/login'}>
                        Go to Login
                    </button>
                </div>
            )}

            {!playerId ? (
                <div className="game-controls">
                    <button className="gradient-button" onClick={createRoom}>Create Room</button>
                    <button className="gradient-button" onClick={handleClickOpenDialog}>Join Room</button>

                    {/* Dialog for entering Room ID */}
                                    <Dialog 
                    open={openDialog} 
                    onClose={handleCloseDialog} 
                    sx={{
                        '& .MuiDialog-paper': {
                            backgroundColor: 'var(--primary-bg-dark)', // Dark Dialog background color
                            color: 'var(--text-color-dark)', // Dark Dialog text color
                        },
                    }}
                >
                    <DialogTitle sx={{ 
                        backgroundColor: 'var(--secondary-bg-dark)', // Dark Title background color
                        color: 'var(--text-color-dark)', // Title text color
                    }}>
                        Enter Room ID
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="roomId"
                            label="Room ID"
                            fullWidth
                            variant="standard"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            sx={{ 
                                '& .MuiInputBase-root': { 
                                    color: 'var(--text-color-dark)', // Input text color for dark theme
                                },
                                '& label': {
                                    color: '#ccc', // Label color for dark theme
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: 'var(--accent-color)', // Label color when focused
                                },
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: '#666', // Underline color before focused
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottomColor: 'var(--accent-color)', // Underline color when focused
                                },
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} sx={{ color: 'var(--accent-color)' }}>Cancel</Button>
                        <Button onClick={joinRoom} sx={{ color: 'var(--accent-color)' }}>Join</Button>
                    </DialogActions>
                </Dialog>
                </div>
            ) : (
                <div className="game-layout">
                    <div className="game-info">
                        <p>Room ID: {roomId}</p>
                        <p>Your Symbol: {playerSymbol}</p>
                        <p>Current Player: {currentPlayer}</p>
                        <p>{message}</p>
                        {winner && <p>Game Over! {winner === 'draw' ? "It's a draw!" : `Winner: ${winner}`}</p>}
                    </div>
                    <div className="board-container">
                        {renderBoard()}
                    </div>
                </div>

            )}
        </div>
    );  
};

export default Game;
