const express = require('express');
const { register, login, adminLogin } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);

// Dummy logout endpoint, real invalidation is client-side by deleting token
router.post('/logout', authMiddleware, (req, res) => {
  res.json({ success: true, message: 'Logout berhasil' });
});

module.exports = router;
