const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    matchesPlayed: { type: Number, default: 0 },
    matchesWon: { type: Number, default: 0 },
    matchesLost: { type: Number, default: 0 },
    playerScore: { type: Number, default: 0 },
    avatar: { type: String, default: 'defaultAvatar.png' } // Default avatar
});

const User = mongoose.model('User', userSchema);
module.exports = User;