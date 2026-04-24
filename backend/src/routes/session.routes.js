const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/active', verifyToken, sessionController.getActiveSessions);
router.put('/:id/confirm', verifyToken, sessionController.confirmCompletion);

module.exports = router;
