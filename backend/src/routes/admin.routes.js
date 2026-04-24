const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// All routes here require admin token
router.get('/stats', verifyToken, isAdmin, adminController.getDashboardStats);
router.get('/reports', verifyToken, isAdmin, adminController.getAllReports);
router.get('/users', verifyToken, isAdmin, adminController.getAllUsers);
router.get('/sessions', verifyToken, isAdmin, adminController.getAllSessions);
router.put('/users/:id/ban', verifyToken, isAdmin, adminController.banUser);
router.put('/users/:id/unban', verifyToken, isAdmin, adminController.unbanUser);

module.exports = router;
