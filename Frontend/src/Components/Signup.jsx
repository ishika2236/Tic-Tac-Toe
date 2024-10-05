import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css'; 
import avatar1 from '/home/ishika/Documents/CSE/PLACEMENT/MERN STACK/Tic Tac Toe/Frontend/public/avatars/avatar1.jpg';
import avatar2 from '/home/ishika/Documents/CSE/PLACEMENT/MERN STACK/Tic Tac Toe/Frontend/public/avatars/avatar2.jpg';
import avatar3 from '/home/ishika/Documents/CSE/PLACEMENT/MERN STACK/Tic Tac Toe/Frontend/public/avatars/avatar3.jpg';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatar, setAvatar] = useState('defaultAvatar.jpg'); // Default avatar
    const [loading, setLoading] = useState(false); // Loading state
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        setLoading(true); // Start loading
        setErrorMessage(''); // Clear previous error message

        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { username, password, avatar });
            localStorage.setItem('token', res.data.token);
            navigate('/game');
        } catch (err) {
            // Check for response data
            const message = err.response?.data?.message || 'Server error';
            setErrorMessage('Error creating account: ' + message);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="container">
            <div className="animation-side">
                <h2>Select an Avatar:</h2>
                <div className="avatar-selection">
                    <img 
                        src={avatar1}
                        alt="Avatar 1" 
                        className={avatar === '../../../public/avatars/avatar1.jpg' ? 'selected' : ''} 
                        onClick={() => setAvatar('../../../public/avatars/avatar1.jpg')} 
                    />
                    <img 
                        src={avatar2}
                        alt="Avatar 2" 
                        className={avatar === '../../../public/avatars/avatar2.jpg' ? 'selected' : ''} 
                        onClick={() => setAvatar('../../../public/avatars/avatar2.jpg')} 
                    />
                    <img 
                       src={avatar3}
                        alt="Avatar 3" 
                        className={avatar === '../../../public/avatars/avatar3.jpg' ? 'selected' : ''} 
                        onClick={() => setAvatar('../../../public/avatars/avatar3.jpg')} 
                    />
                </div>
            </div>
            <div className="form-side">
                <div className="signup-form">
                    <h1>Sign Up</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="gradient-button" disabled={loading}>
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </form>
                    <p>Already have an account? <span className="link" onClick={() => navigate('/login')}>Login here</span></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
