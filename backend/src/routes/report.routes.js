const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/', verifyToken, reportController.submitReport);
router.get('/me', verifyToken, reportController.getMyReports);

module.exports = router;
