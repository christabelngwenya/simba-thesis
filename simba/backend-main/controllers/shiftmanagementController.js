const { ShiftType, Shift } = require('../models/shiftmanagementModels.js');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Get all shift types
exports.getShiftTypes = async (req, res) => {
  try {
    const shiftTypes = await ShiftType.findAll();
    res.json(shiftTypes);
  } catch (error) {
    console.error('Error fetching shift types:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new shift type
exports.createShiftType = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { shiftname, defaultduration, shiftcategory } = req.body;
    
    const newShiftType = await ShiftType.create({
      shiftname,
      defaultduration,
      shiftcategory
    });

    res.status(201).json(newShiftType);
  } catch (error) {
    console.error('Error creating shift type:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update shift type
exports.updateShiftType = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const shiftType = await ShiftType.findByPk(req.params.id);
    if (!shiftType) {
      return res.status(404).json({ message: 'Shift type not found' });
    }

    const { shiftname, defaultduration, shiftcategory } = req.body;
    await shiftType.update({ shiftname, defaultduration, shiftcategory });
    res.json(shiftType);
  } catch (error) {
    console.error('Error updating shift type:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete shift type
exports.deleteShiftType = async (req, res) => {
  try {
    const shiftType = await ShiftType.findByPk(req.params.id);
    if (!shiftType) {
      return res.status(404).json({ message: 'Shift type not found' });
    }

    await shiftType.destroy();
    res.json({ message: 'Shift type deleted successfully' });
  } catch (error) {
    console.error('Error deleting shift type:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all shifts
exports.getShifts = async (req, res) => {
  try {
    const shifts = await Shift.findAll({
      include: [{
        model: ShiftType,
        as: 'shifttype', // Add the alias here
        attributes: ['shiftname', 'defaultduration'] // Include specific attributes
      }]
    });
    res.json(shifts);
  } catch (error) {
    console.error('Error fetching shifts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search shifts by shifttypeid, shiftid, shiftname, or shiftduration
exports.searchShifts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const shifts = await Shift.findAll({
      where: {
        [Op.or]: [
          { shifttypeid: query },
          { shiftid: query },
          { '$ShiftType.shiftname$': { [Op.iLike]: `%${query}%` } },
          { shiftduration: { [Op.eq]: query } }
        ]
      },
      include: [{
        model: ShiftType,
        attributes: ['shiftname', 'defaultduration']
      }]
    });

    res.json(shifts);
  } catch (error) {
    console.error('Error searching shifts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new shift
exports.createShift = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { 
      shifttypeid,
      shiftstarttime,
      shiftendtime,
      shiftlocation
    } = req.body;

    // Validate shift type exists
    const shiftType = await ShiftType.findByPk(shifttypeid);
    if (!shiftType) {
      return res.status(400).json({
        message: 'Validation error',
        errors: ['Invalid shift type']
      });
    }

    // Validate dates
    const startDate = new Date(shiftstarttime);
    const endDate = new Date(shiftendtime);
    
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({
        message: 'Validation error',
        errors: ['Invalid start time format']
      });
    }

    if (isNaN(endDate.getTime())) {
      return res.status(400).json({
        message: 'Validation error',
        errors: ['Invalid end time format']
      });
    }

    const newShift = await Shift.create({
      shifttypeid,
      shiftstarttime: startDate,
      shiftendtime: endDate,
      shiftlocation: shiftlocation || null
    });

    res.status(201).json(newShift);
  } catch (error) {
    console.error('Error creating shift:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => {
        if (e.path === 'shifttypeid') return 'Invalid shift type';
        if (e.path.includes('time')) return 'Invalid time format';
        return e.message;
      });
      
      return res.status(400).json({ 
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// Update shift
exports.updateShift = async (req, res) => {
  try {
    const shift = await Shift.findByPk(req.params.id);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    const updatedShift = await shift.update(req.body);
    res.json(updatedShift);
  } catch (error) {
    console.error('Error updating shift:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete shift
exports.deleteShift = async (req, res) => {
  try {
    const shift = await Shift.findByPk(req.params.id);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    await shift.destroy();
    res.json({ message: 'Shift deleted successfully' });
  } catch (error) {
    console.error('Error deleting shift:', error);
    res.status(500).json({ message: 'Server error' });
  }
};