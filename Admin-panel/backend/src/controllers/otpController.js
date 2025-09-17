const OTPService = require('../services/otpService');
const Booking = require('../models/Booking');

/**
 * Generate OTP for a booking
 * @route POST /api/otp/generate/:bookingId
 */
const generateOTP = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    // Check if booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Generate OTP
    const otp = await OTPService.createOTP(bookingId);
    
    // Update booking with OTP
    await Booking.findByIdAndUpdate(bookingId, { 
      otp: otp.code,
      otpVerified: false 
    });

    res.json({ 
      message: 'OTP generated successfully',
      otp: otp.code,
      expiresAt: new Date(otp.sentTime.getTime() + 10 * 60 * 1000), // 10 minutes from now
      bookingId 
    });

  } catch (error) {
    console.error('Generate OTP error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Verify OTP for a booking
 * @route POST /api/otp/verify
 */
const verifyOTP = async (req, res) => {
  try {
    const { bookingId, otpCode } = req.body;

    if (!bookingId || !otpCode) {
      return res.status(400).json({ 
        error: 'Missing required fields: bookingId and otpCode' 
      });
    }

    // Verify OTP
    const isValid = await OTPService.verifyOTP(bookingId, otpCode);
    
    if (isValid) {
      res.json({ 
        message: 'OTP verified successfully',
        verified: true,
        bookingId 
      });
    } else {
      res.status(400).json({ 
        error: 'Invalid or expired OTP',
        verified: false 
      });
    }

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Regenerate OTP for a booking
 * @route POST /api/otp/regenerate/:bookingId
 */
const regenerateOTP = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    // Check if booking exists
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Regenerate OTP
    const otp = await OTPService.regenerateOTP(bookingId);
    
    res.json({ 
      message: 'OTP regenerated successfully',
      otp: otp.code,
      expiresAt: new Date(otp.sentTime.getTime() + 10 * 60 * 1000), // 10 minutes from now
      bookingId 
    });

  } catch (error) {
    console.error('Regenerate OTP error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get OTP details for a booking
 * @route GET /api/otp/:bookingId
 */
const getOTP = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const otp = await OTPService.getOTP(bookingId);
    if (!otp) {
      return res.status(404).json({ error: 'OTP not found for this booking' });
    }

    const isExpired = OTPService.isOTPExpired(otp.sentTime);
    
    res.json({
      otp: otp.code,
      sentTime: otp.sentTime,
      verified: otp.verified,
      expired: isExpired,
      expiresAt: new Date(otp.sentTime.getTime() + 10 * 60 * 1000),
      bookingId
    });

  } catch (error) {
    console.error('Get OTP error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get OTP statistics
 * @route GET /api/otp/stats/overview
 */
const getOTPStats = async (req, res) => {
  try {
    const stats = await OTPService.getOTPStats();
    
    res.json({
      message: 'OTP statistics retrieved successfully',
      stats
    });

  } catch (error) {
    console.error('Get OTP stats error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Clean up expired OTPs
 * @route POST /api/otp/cleanup
 */
const cleanupExpiredOTPs = async (req, res) => {
  try {
    const deletedCount = await OTPService.cleanupExpiredOTPs();
    
    res.json({
      message: 'Expired OTPs cleaned up successfully',
      deletedCount
    });

  } catch (error) {
    console.error('Cleanup OTPs error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all OTPs with pagination and filters
 * @route GET /api/otp/list
 */
const getAllOTPs = async (req, res) => {
  try {
    const { page = 1, limit = 20, verified, expired } = req.query;
    
    const query = {};
    
    if (verified !== undefined) {
      query.verified = verified === 'true';
    }
    
    if (expired === 'true') {
      query.sentTime = { $lt: new Date(Date.now() - 10 * 60 * 1000) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [otps, total] = await Promise.all([
      require('../models/Otp').find(query)
        .populate('bookingId', 'userId emergencyLevel status')
        .sort({ sentTime: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      require('../models/Otp').countDocuments(query)
    ]);

    res.json({
      otps,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });

  } catch (error) {
    console.error('Get all OTPs error:', error);
    res.status(500).json({ error: error.message });
  }
};


const testEmailConfig = async (req, res) => {
  try {
    const emailService = require('../services/emailService');
    const result = await emailService.testEmailConfig();
    
    res.json({
      message: 'Email configuration test completed',
      result
    });

  } catch (error) {
    console.error('Email config test error:', error);
    res.status(500).json({ error: error.message });
  }
};

 
const resendOTPEmail = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const result = await OTPService.resendOTPEmail(bookingId);
    
    res.json({
      message: 'OTP email resent successfully',
      sentTo: result.sentTo,
      bookingId
    });

  } catch (error) {
    console.error('Resend OTP email error:', error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  generateOTP,
  verifyOTP,
  regenerateOTP,
  resendOTPEmail,  // New function
  getOTP,
  getOTPStats,
  cleanupExpiredOTPs,
  getAllOTPs,
  testEmailConfig  // New function
};