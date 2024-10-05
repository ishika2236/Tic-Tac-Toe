import './App.css';
import Game from './Components/Game';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Profile from './Components/Profile';
import Navbar from './Components/Navbar';

function App() {
  // A helper function to check if the user is authenticated
  const isAuthenticated = () => {
    // You can replace localStorage with sessionStorage depending on your needs
    return !!localStorage.getItem('token');
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Redirect to login if no token, else show Game as the root page */}
        <Route 
          path="/" 
          element={isAuthenticated() ? <Game /> : <Navigate to="/login" />} 
        />
        
        {/* If no token and tries to visit /game directly, redirect to login */}
        <Route 
          path="/game" 
          element={isAuthenticated() ? <Game /> : <Navigate to="/login" />} 
        />
        
        {/* Login and Signup Routes */}
        <Route path="/login" element={isAuthenticated() ?<Navigate to="/Game" /> :<Login />} />
        <Route path="/signup" element={<Signup />} />


        {/* Profile Route - Only accessible if authenticated */}
        <Route 
          path="/profile" 
          element={isAuthenticated() ? <Profile /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
