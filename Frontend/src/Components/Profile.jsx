import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trophy, XCircle, MinusCircle } from 'lucide-react';
import './Profile.css'

const Profile = () => {
    const [profileData, setProfileData] = useState({
        name: "",
        playerScore: null,
        matchesWon: null,
        matchesLost: null,
        matchesDraw: null,
        matchHistory: [],
        avatar: null
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get("http://localhost:5000/api/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response.data);
                setProfileData(response.data);
            } catch (error) {
                console.log("Error fetching profile data:", error);
            }
        };

        fetchProfileData();
    }, []);

    return (
        <div className="container">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar-section">
                        <img src={profileData.avatar || "/api/placeholder/150/150"} alt="profile" className="profile-avatar" />
                        <h2>{profileData.name}</h2>
                        <p className="player-score">Score: {profileData.playerScore}</p>
                    </div>
                    <div className="profile-stats">
                        <div className="stat">
                            <Trophy size={24} />
                            <span>{profileData.matchesWon}</span>
                            <p>Won</p>
                        </div>
                        <div className="stat">
                            <XCircle size={24} />
                            <span>{profileData.matchesLost}</span>
                            <p>Lost</p>
                        </div>
                        <div className="stat">
                            <MinusCircle size={24} />
                            <span>{profileData.matchesDraw}</span>
                            <p>Draw</p>
                        </div>
                    </div>
                </div>
                <div className="match-history">
                    <h3>Match History</h3>
                    <div className="match-cards">
                        {profileData.matchHistory.map((match, index) => (
                            <div className={`match-card ${match.winner === profileData.name ? 'win' : 'loss'}`} key={index}>
                                <div className="match-players">
                                    <div className="player">
                                        <img src={match.playerX.avatar || "/api/placeholder/40/40"} alt={match.playerX.username} className="player-avatar" />
                                        <span>{match.playerX.username}</span>
                                    </div>
                                    <span>vs</span>
                                    <div className="player">
                                        <img src={match.playerO.avatar || "/api/placeholder/40/40"} alt={match.playerO.username} className="player-avatar" />
                                        <span>{match.playerO.username}</span>
                                    </div>
                                </div>
                                <p>Date: {new Date(match.date).toLocaleDateString()}</p>
                                <p>Winner: {match.winner}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;