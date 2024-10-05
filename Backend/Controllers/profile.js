const User = require('../Models/user');
const Match = require('../Models/match');
const jwt = require('jsonwebtoken');

const getProfile = async (req, res) => {
    try {
        // Extract token from request headers
        const token = req.headers.authorization.split(' ')[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.user);
        console.log(decoded, user);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const matches = await Match.find({ $or: [{ playerX: user._id }, { playerO: user._id }] })
            .sort({ date: -1 })
            .limit(10)
            .populate('playerX', 'username avatar')
            .populate('playerO', 'username avatar')
            .populate('winner', 'username');

        const matchesDraw = user.matchesPlayed - (user.matchesWon + user.matchesLost);

        const matchHistory = matches.map(match => ({
            playerX: {
                username: match.playerX.username,
                avatar: match.playerX.avatar
            },
            playerO: {
                username: match.playerO.username,
                avatar: match.playerO.avatar
            },
            date: match.date,
            winner: match.winner ? match.winner.username : 'Draw'
        }));

        // Prepare response data
        const profileData = {
            name: user.username,
            playerScore: user.playerScore,
            matchesWon: user.matchesWon,
            matchesLost: user.matchesLost,
            matchesDraw: matchesDraw,
            matchHistory: matchHistory,
            avatar: user.avatar
        };

        res.status(200).json(profileData);
    } catch (error) {
        console.error('Error fetching profile data:', error);
        res.status(500).json({ message: 'Error fetching profile data', error: error.message });
    }
};

module.exports = { getProfile };