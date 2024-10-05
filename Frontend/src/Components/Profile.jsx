import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [profileData, setProfileData] = useState({
        name: "",
        playerScore: null,
        matchesWon: null,
        matchesLost: null,
        matchesDraw: null,
        matchHistory: []
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
                setProfileData(response.data);
            } catch (error) {
                console.log("Error fetching profile data:", error);
            }
        };

        fetchProfileData();
    }, []);

    return (
        <div className="card profile-container">
            <h2>{profileData.name}'s Profile</h2>
            <div className="profile-stats">
                <div className="stat">
                    <span>Won: {profileData.matchesWon}</span>
                </div>
                <div className="stat">
                    <span>Lost: {profileData.matchesLost}</span>
                </div>
                <div className="stat">
                    <span>Draw: {profileData.matchesDraw}</span>
                </div>
            </div>
            <div className="player-score">
                <h3>Player Score</h3>
                <p className="accent">{profileData.playerScore}</p>
            </div>
            <div className="match-history">
                <h3>Match History</h3>
                <div className="match-cards">
                    {profileData.matchHistory.map((match, index) => (
                        <div className="match-card" key={index}>
                            <p>{match.playerX} vs {match.playerO}</p>
                            <p>Date: {new Date(match.date).toLocaleDateString()}</p>
                            <p>Winner: {match.winner}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;