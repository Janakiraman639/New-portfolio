const express = require('express');
const router = express.Router();
const { login, getMe, logout, changePassword } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.post('/logout', logout);
router.put('/change-password', authenticateToken, changePassword);

module.exports = router;
