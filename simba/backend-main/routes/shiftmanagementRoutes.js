const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const controller = require('../controllers/shiftmanagementController');

// Shift Type Routes
router.get('/shift-types', controller.getShiftTypes);
router.post('/shift-types', [
  check('shiftname').notEmpty(),
  check('defaultduration').isInt({ min: 1 })
], controller.createShiftType);
router.put('/shift-types/:id', [
  check('shiftname').notEmpty(),
  check('defaultduration').isInt({ min: 1 })
], controller.updateShiftType); // Route for updating a shift type
router.delete('/shift-types/:id', controller.deleteShiftType); // Route for deleting a shift type

// Shift Routes
router.get('/shifts', controller.getShifts);
router.get('/shifts/search', controller.searchShifts);
router.post('/shifts', [
  check('shifttypeid').isUUID(),
  check('shiftstarttime').isISO8601(),
  check('shiftendtime').isISO8601()
], controller.createShift);
router.put('/shifts/:id', controller.updateShift);
router.delete('/shifts/:id', controller.deleteShift);

module.exports = router;