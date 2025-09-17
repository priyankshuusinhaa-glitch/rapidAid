const express = require('express');
const {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  toggleDriverStatus,
  getDriverPerformance
} = require('../controllers/driverController');
const auth = require('../middlewares/auth');
const { isManager } = require('../middlewares/role');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/drivers
// @desc    Get all drivers
// @access  Private (Manager+)
router.get('/', isManager, getDrivers);

// @route   GET /api/drivers/:id
// @desc    Get driver by ID
// @access  Private (Manager+)
router.get('/:id', isManager, getDriverById);

// @route   POST /api/drivers
// @desc    Create driver
// @access  Private (Manager+)
router.post('/', isManager, createDriver);

// @route   PUT /api/drivers/:id
// @desc    Update driver
// @access  Private (Manager+)
router.put('/:id', isManager, updateDriver);

// @route   DELETE /api/drivers/:id
// @desc    Delete driver
// @access  Private (Manager+)
router.delete('/:id', isManager, deleteDriver);

// @route   PATCH /api/drivers/:id/status
// @desc    Toggle driver status
// @access  Private (Manager+)
router.patch('/:id/status', isManager, toggleDriverStatus);

// @route   GET /api/drivers/:id/performance
// @desc    Get driver performance
// @access  Private (Manager+)
router.get('/:id/performance', isManager, getDriverPerformance);

module.exports = router;
