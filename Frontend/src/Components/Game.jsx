import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
// import socket from '../utils/socket'
const socket = io('http://localhost:5000');

const Game = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentplayer]=useState('X');
    const [winner, setWinner]=useState(null);
    const [roomId, setRoomId] = useState('');
    const [playerId, setPlayerId] = useState('');
    const [playerSymbol, setPlayerSymbol] = useState('');
    const [message, setMessage] = useState('');
    useEffect(()=>{
        socket.on('roomCreated', ({ roomId, playerId, symbol }) => {
            setRoomId(roomId);
            setPlayerId(playerId);
            setPlayerSymbol(symbol);
            setMessage(`Room created. Your symbol is ${symbol}. Waiting for opponent...`);
        });
        socket.on('gameJoined', ({ roomId, playerId, symbol }) => {
            setRoomId(roomId);
            setPlayerId(playerId);
            setPlayerSymbol(symbol);
            setMessage(`Joined room ${roomId}. Your symbol is ${symbol}.`);
        });
        socket.on('gameData',({ board, currentPlayer, players })=>{
            setBoard(board);
            setCurrentplayer(currentPlayer);
        });
        socket.on('gameOver',({winner})=>{
            setWinner(winner);
            setMessage(winner === 'draw' ? "It's a draw!" : `Winner: ${winner}`);
        });
        socket.on('error', ({ message }) => {
            setMessage(message);
        });
        return () => {
            socket.off('roomCreated');
            socket.off('gameJoined');
            socket.off('gameData');
            socket.off('gameOver');
            socket.off('error');
        };
    },[])

    const createRoom = (e) => {
        e.preventDefault();
        socket.emit('createRoom');
    };

    const joinRoom = (roomId, e) => {
        e.preventDefault();
        if (roomId) {
            socket.emit('joinRoom', roomId);
        }
    };

    const handleClick = (index) => {
        if (!board[index] && !winner  && currentPlayer === playerSymbol) {
            socket.emit('makeMove', { roomId: {roomId}, index });
        }
    };
  return (
    <div>
            {!playerId ? (
                <div>
                   <form onSubmit={createRoom}>
                        <button>Create Room</button>
                    </form>
                    
                    <form onSubmit={(e) => joinRoom(roomId, e)}>
                        <input
                            type="text"
                            placeholder="Enter Room ID"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                        <button type="submit">Join Room</button>
                    </form>
                </div>
            ) : (
                <div>
                    <p>Room ID: {roomId}</p>
                    <p>Your Symbol: {playerSymbol}</p>
                    <p>Current Player: {currentPlayer}</p>
                    <p>{message}</p>
                    <div className="board">
                        {board.map((cell, index) => (
                            <button key={index} onClick={() => handleClick(index)} disabled={currentPlayer !== playerSymbol || winner}>
                                {cell}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
  )
}

export default Game