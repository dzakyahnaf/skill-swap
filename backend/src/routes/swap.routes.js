const express = require('express');
const router = express.Router();
const swapController = require('../controllers/swap.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/', verifyToken, swapController.sendSwapRequest);
router.get('/incoming', verifyToken, swapController.getIncomingRequests);
router.put('/:id/accept', verifyToken, swapController.acceptSwapRequest);
router.put('/:id/reject', verifyToken, swapController.rejectSwapRequest);

module.exports = router;
