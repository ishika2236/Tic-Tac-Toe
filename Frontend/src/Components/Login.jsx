import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Make sure to import the CSS file

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            console.log("token: ", res.data.token);
            localStorage.setItem('token', res.data.token);
            navigate('/Game');
        } catch (err) {
            alert('Invalid credentials');
        }
    };

    const openSignup = () => {
        navigate('/signup');
    }

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
                <div className="login-form">
                    <h1>Tic Tac Toe</h1>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        <button type="submit">Login</button>
                    </form>
                    <div className="register-link" onClick={openSignup}>New to the game? Register Here</div>
                </div>
            </div>
        </div>
    );
};

export default Login;
