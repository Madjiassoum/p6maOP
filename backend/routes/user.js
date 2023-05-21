const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const passwordValid = require('../middleware/password');

// Route post signup
router.post('/signup', passwordValid, userCtrl.signup);
// Route post login
router.post('/login', userCtrl.login);

module.exports = router;