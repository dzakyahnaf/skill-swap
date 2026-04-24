const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Search is public/logged-in
router.get('/search', verifyToken, userController.searchUsers);

// Profile routes
router.get('/me', verifyToken, userController.getMe);
router.put('/me', verifyToken, userController.updateProfile);
router.get('/:id', verifyToken, userController.getUserProfile);

module.exports = router;
