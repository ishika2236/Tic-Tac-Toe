const {register, login, getProfile} =  require('../Controllers/user')
const express = require('express');

const router = express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/profile',getProfile);

module.exports = router;