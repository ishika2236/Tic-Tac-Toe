import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import axios from 'axios'
import './Navbar.css';

const Navbar = () => {
  const [mode, setMode] = useState('dark');
  const [avatar, setAvatar] = useState(''); // State for the avatar URL
  const navigate = useNavigate(); // Use useNavigate for navigation

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.body.className = mode === 'dark' ? 'dark-mode' : 'light-mode';
  }, [mode]);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user data to get the avatar URL
      const fetchUserData = async () => {
        try {
            // const token = localStorage.getItem('token');
            const response = await axios.get("http://localhost:5000/api/profile", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response)
            if (response.status === 200) {
                console.log("setting avatar: ", response.data.avatar)
                setAvatar(response.data.avatar);
                console.log("Avatar set:", response.data.avatar); 
              } 
              
              else {
                throw new Error('Failed to fetch user data');
              }// Assuming the avatar URL is in the `avatar` field of the response
        } catch (error) {
            if(error.response.status === 401){
                localStorage.removeItem('token');
                navigate('/login');
            }
          console.error('Error fetching user data:', error);

        }
      };

      fetchUserData();
    }
  }, []); // Fetch user data only once when the component mounts

  return (
    <div className="navbar">
      <div onClick={() => navigate('/game')}className="nav-left">
        <h2>Tic Tac Toe</h2>
      </div>
      <div className="nav-right">
        <div onClick={() => navigate('/profile')}>
          {avatar && <img src={avatar} alt="Avatar" className="avatar" />} {}
        </div>
        <button onClick={toggleColorMode}>
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
