const express = require('express');
const {
  getAmbulances,
  getAmbulanceById,
  createAmbulance,
  updateAmbulance,
  deleteAmbulance,
  updateAmbulanceLocation,
  getAvailableAmbulances,
  getAmbulancesByRegion
} = require('../controllers/ambulanceController');
const auth = require('../middlewares/auth');
const { isManager, isDispatcher } = require('../middlewares/role');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/ambulances
// @desc    Get all ambulances
// @access  Private (Manager+)
router.get('/', isManager, getAmbulances);

// @route   GET /api/ambulances/available
// @desc    Get available ambulances
// @access  Private (Dispatcher+)
router.get('/available', isDispatcher, getAvailableAmbulances);

// @route   GET /api/ambulances/region
// @desc    Get ambulances by region
// @access  Private (Dispatcher+)
router.get('/region', isDispatcher, getAmbulancesByRegion);

// @route   GET /api/ambulances/:id
// @desc    Get ambulance by ID
// @access  Private (Manager+)
router.get('/:id', isManager, getAmbulanceById);

// @route   POST /api/ambulances
// @desc    Create ambulance
// @access  Private (Manager+)
router.post('/', isManager, createAmbulance);

// @route   PUT /api/ambulances/:id
// @desc    Update ambulance
// @access  Private (Manager+)
router.put('/:id', isManager, updateAmbulance);

// @route   DELETE /api/ambulances/:id
// @desc    Delete ambulance
// @access  Private (Manager+)
router.delete('/:id', isManager, deleteAmbulance);

// @route   PATCH /api/ambulances/:id/location
// @desc    Update ambulance location
// @access  Private (Driver)
router.patch('/:id/location', updateAmbulanceLocation);

module.exports = router;
