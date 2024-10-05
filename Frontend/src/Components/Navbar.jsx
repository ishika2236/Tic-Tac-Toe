import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import './Navbar.css'

const Navbar = () => {
  const [mode, setMode] = useState('dark');

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.body.className = mode === 'dark' ? 'dark-mode' : 'light-mode';
  }, [mode]);

  return (
    <div className="navbar">
        <div className="nav-left">
        <h2>Tic Tac Toe</h2>
        </div>
        <div className="nav-right">
        <div className="nav-links">
        {/* <Link to="/login">Login</Link> */}
        {/* <Link to="/signup">Signup</Link> */}
        {/* <Link to="/game">Game</Link> */}
        <Link to="/profile">Profile</Link>
      </div>
      <button onClick={toggleColorMode}>
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </button>
        </div>
        
     
    </div>
  );
};

export default Navbar;
