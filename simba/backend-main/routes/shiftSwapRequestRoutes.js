const express = require('express');
const router = express.Router();
const shiftSwapRequestController = require('../controllers/shiftSwapRequestController');

// Existing routes
router.post('/shift-swap', shiftSwapRequestController.createShiftSwapRequest);
router.get('/shift-swap/pending', shiftSwapRequestController.getPendingRequests);
router.put('/shift-swap/:id', shiftSwapRequestController.updateShiftSwapRequest);
router.delete('/shift-swap/:id', shiftSwapRequestController.deleteShiftSwapRequest);

// New route for approve/reject action
router.put('/shift-swap/:id/action', shiftSwapRequestController.handleAction);

module.exports = router;
