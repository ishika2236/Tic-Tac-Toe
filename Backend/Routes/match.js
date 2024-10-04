const getMatchHistory = require('../Controllers/match')
const express = require('express');
const authMiddleware = require('../Middleware/auth')

const router = express.Router();

router.get('/history',getMatchHistory);
module.exports = router;
