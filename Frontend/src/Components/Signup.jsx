import React , {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Signup = () => {
    const [username, setUsername]= useState('');
    const [password, setPassword]= useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventdefault();
        try {
            const res = await axios.post('http://localhost:5000/register');
            localStorage.setItem('token',res.data.token);
            navigate('/game');
            
        } catch (error) {
            alert('Invalid credentials');
        }

    }
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit">Signuo</button>
        </form>

    </div>
  )
}

export default Signup