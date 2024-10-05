const User = require('../Models/user');
const Match = require('../Models/match');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const {getProfile} = require('../Controllers/profile');

router.get('/',getProfile);
module.exports=  router;