const express = require('express');
const router = express.Router();
const { signup, login, getMe, updateMe, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/me/password', protect, updatePassword);

module.exports = router;
