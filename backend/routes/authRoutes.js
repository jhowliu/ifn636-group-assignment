
const express = require('express');
const { registerUser, loginUser, updateUserProfile, getProfile } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authChain');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateUserProfile);

module.exports = router;
