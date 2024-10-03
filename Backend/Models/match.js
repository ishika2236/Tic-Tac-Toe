const mongoose = require('mongoose');

const matchSchema = mongoose.Schema({
    playerX : {type: mongoose.Schema.Types.ObjectId, ref : 'User', required:true},
    playerO : {type: mongoose.Schema.Types.ObjectId, ref : 'User', required:true},
    winner : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    date: {type:Date, default:Date.now},
});

const Match = mongoose.model('Match',matchSchema);
module.exports = Match;