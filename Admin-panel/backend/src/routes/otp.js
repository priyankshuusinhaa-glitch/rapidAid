const express = require('express');
const rateLimit = require('express-rate-limit');
const auth = require('../middlewares/auth');
const { isManager } = require('../middlewares/role');
const {
  generateOTP,
  verifyOTP,
  regenerateOTP,
  getOTP,
  getOTPStats,
  cleanupExpiredOTPs,
  getAllOTPs,
  testEmailConfig,
  resendOTPEmail
} = require('../controllers/otpController');

const router = express.Router();

// Basic rate limiter for OTP endpoints
const otpLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 10 });

// Public route to verify OTP (no duplicate route)
router.post('/verify', otpLimiter, verifyOTP);

// Protected routes (require authentication)
router.use(auth);

// OTP management routes (require manager role)
router.post('/generate/:bookingId', isManager, otpLimiter, generateOTP);
router.post('/regenerate/:bookingId', isManager, otpLimiter, regenerateOTP);
router.get('/:bookingId', isManager, getOTP);
router.get('/stats/overview', isManager, getOTPStats);
router.post('/cleanup', isManager, cleanupExpiredOTPs);
router.get('/list', isManager, getAllOTPs);

// Email-specific routes
router.post('/resend-email/:bookingId', isManager, otpLimiter, resendOTPEmail);
router.get('/test-email', isManager, testEmailConfig);

module.exports = router;


