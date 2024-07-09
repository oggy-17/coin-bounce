const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

// testing

router.get('/test', (req, res) => res.json({msg: 'Working from Test'}));

// login

router.post('/login', authController.login);

// register

router.post('/register', authController.register);
module.exports = router;