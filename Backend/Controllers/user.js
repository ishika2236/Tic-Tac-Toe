const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const register = async (req,res)=>{
    const {username, password} = req.body;
    console.log(username, password);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({username, password: hashedPassword});
        await user.save();
        console.log("user saved");
        
        const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, { expiresIn: '1hr' });
        res.status(200).json({ token:token });

    } catch (error) {
        console.log(error);
        
        res.status(500).send('Server error');
        
    }
}

const login = async (req,res) => {
    const {username, password} = req.body;
    console.log("hello from login");
    
    try {
        const user = await User.findOne({username});
        if(!user) return res.status(400).json({message: 'User not found'});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status (400).json({message: 'Incorrect Password'});
        const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, { expiresIn: '1hr' });
        res.status(200).json({ token:token });

        
    } catch (error) {
        res.status(500).send('Server error');
        
    }
}


module.exports={
    register, login
}