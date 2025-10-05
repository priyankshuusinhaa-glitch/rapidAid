const express = require('express');
const {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriverProfile,
  deleteDriver,
  toggleDriverStatus,
  getDriverEarningsSummary,
  getDriverPerformanceMetrics
} = require('../controllers/driverController');
const auth = require('../middlewares/auth');
const { isManager } = require('../middlewares/role');
const router = express.Router();
//  All routes require authentication
router.use(auth);
//  Get all drivers
router.get('/', isManager, getDrivers);
//  Get driver by ID
router.get('/:id', isManager, getDriverById);
//  Create driver (Manager only)
router.post('/', isManager, createDriver);
//  Update driver profile (driver self or manager)
router.patch('/:id/profile', updateDriverProfile);
//  Delete driver
router.delete('/:id', isManager, deleteDriver);
//  Toggle driver status (Manager only)
router.patch('/:id/status', isManager, toggleDriverStatus);
//  Driver earnings / summary
router.get('/:id/earnings', getDriverEarningsSummary);
router.get('/:id/performance', getDriverPerformanceMetrics);

module.exports = router;
