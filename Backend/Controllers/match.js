const Match = require('../Models/match')

const getMatchHistory = async(req,res)=>{
    try {
        const matches = await Match.find({
            $or :[
                { playerX: req.user.id },
                { playerO: req.user.id }
            ]
        }).populate('playerX playerO', username).sort({date: -1});

        res.json(matches);
        
    } catch (error) {
        res.status(500).json({message: 'Server error'});
        
    }
}
module.exports = getMatchHistory;