const express = require('express');
const { bookingAnalytics, revenueAnalytics, driverPerformance, emergencyStats, bookingHeatmap } = require('../controllers/analyticsController');
const auth = require('../middlewares/auth');
const { isManager } = require('../middlewares/role');

const router = express.Router();

router.use(auth, isManager);

router.get('/bookings', bookingAnalytics);
router.get('/revenue', revenueAnalytics);
router.get('/drivers/performance', driverPerformance);
router.get('/emergency', emergencyStats);
router.get('/heatmap', bookingHeatmap);

module.exports = router;
