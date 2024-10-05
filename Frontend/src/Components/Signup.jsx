import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/api/auth/signup', { username, password });
            localStorage.setItem('token', res.data.token);
            navigate('/game');
        } catch (err) {
            alert('Error creating account');
        }
    };

    // Effect to add animation similar to Login component
    useEffect(() => {
        const interval = setInterval(() => {
            const cells = document.querySelectorAll('.grid-cell');
            const emptyCell = Array.from(cells).find(cell => !cell.hasChildNodes());
            if (emptyCell) {
                const symbol = Math.random() > 0.5 ? 'X' : 'O';
                const span = document.createElement('span');
                span.textContent = symbol;
                span.className = symbol.toLowerCase();
                emptyCell.appendChild(span);
            } else {
                cells.forEach(cell => cell.innerHTML = '');
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container">
            <div className="animation-side">
                <div className="tic-tac-toe-grid">
                    {[...Array(9)].map((_, index) => (
                        <div key={index} className="grid-cell"></div>
                    ))}
                </div>
                <div className="floating-shape shape1"></div>
                <div className="floating-shape shape2"></div>
                <div className="floating-shape shape3"></div>
            </div>
            <div className="form-side">
                <div className="signup-form">
                    <h1>Tic Tac Toe</h1>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                        <button type="submit">Sign Up</button>
                    </form>
                    <div className="register-link" onClick={() => navigate('/login')}>Already have an account? Login here</div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
