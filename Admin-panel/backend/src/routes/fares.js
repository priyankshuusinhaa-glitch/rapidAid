const express = require('express');
const { calculate, overrideFare, updatePayment, history } = require('../controllers/fareController');
const auth = require('../middlewares/auth');
const { isManager, isDispatcher } = require('../middlewares/role');

const router = express.Router();

router.use(auth);

// Calculate fare (Manager or Dispatcher)
router.post('/:bookingId/calculate', isManager, calculate);

// Override fare (Manager only)
router.post('/:bookingId/override', isManager, overrideFare);

// Update payment status (Manager or Dispatcher)
router.patch('/:bookingId/payment', isManager, updatePayment);

// Fare history
router.get('/:bookingId/history', isManager, history);

module.exports = router;
