const Otp = require('../models/Otp');
const Booking = require('../models/Booking');
const emailService = require('./emailService');

class OTPService {
  /**
   * Generate a new OTP code
   * @returns {string} 4-digit OTP
   */
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Create OTP record for a booking
   * @param {string} bookingId - The booking ID
   * @returns {Object} OTP record
   */
  static async createOTP(bookingId) {
    try {
      // Check if OTP already exists for this booking
      const existingOTP = await Otp.findOne({ bookingId });
      if (existingOTP) {
        // Update existing OTP
        existingOTP.code = this.generateOTP();
        existingOTP.sentTime = new Date();
        existingOTP.verified = false;
        await existingOTP.save();
        return existingOTP;
      }

      // Create new OTP
      const otp = new Otp({
        bookingId,
        code: this.generateOTP(),
        sentTime: new Date(),
        verified: false
      });
      await otp.save();
      return otp;
    } catch (error) {
      throw new Error(`Failed to create OTP: ${error.message}`);
    }
  }

  /**
   * Verify OTP for a booking
   * @param {string} bookingId - The booking ID
   * @param {string} otpCode - The OTP code to verify
   * @returns {boolean} True if valid, false otherwise
   */
  static async verifyOTP(bookingId, otpCode) {
    try {
      const otpRecord = await Otp.findOne({ 
        bookingId, 
        code: otpCode,
        verified: false 
      });
      
      if (!otpRecord) {
        return false;
      }
      
      // Check if OTP is expired (10 minutes)
      const now = new Date();
      const otpAge = now - otpRecord.sentTime;
      const EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds
      
      if (otpAge > EXPIRY_TIME) {
        return false;
      }
      
      // Mark OTP as verified
      otpRecord.verified = true;
      await otpRecord.save();
      
      // Update booking flag only; do not set invalid status value
      await Booking.findByIdAndUpdate(bookingId, { 
        otpVerified: true 
      });
      
      return true;
    } catch (error) {
      throw new Error(`Failed to verify OTP: ${error.message}`);
    }
  }

  /**
   * Regenerate OTP for a booking
   * @param {string} bookingId - The booking ID
   * @returns {Object} New OTP record
   */
  static async regenerateOTP(bookingId) {
    try {
      const otp = await this.createOTP(bookingId);
      
      // Update booking with new OTP
      await Booking.findByIdAndUpdate(bookingId, { 
        otp: otp.code,
        otpVerified: false 
      });
      
      return otp;
    } catch (error) {
      throw new Error(`Failed to regenerate OTP: ${error.message}`);
    }
  }

  /**
   * Get OTP details for a booking
   * @param {string} bookingId - The booking ID
   * @returns {Object} OTP record
   */
  static async getOTP(bookingId) {
    try {
      const otp = await Otp.findOne({ bookingId });
      return otp;
    } catch (error) {
      throw new Error(`Failed to get OTP: ${error.message}`);
    }
  }

  /**
   * Check if OTP is expired
   * @param {Date} sentTime - When OTP was sent
   * @returns {boolean} True if expired, false otherwise
   */
  static isOTPExpired(sentTime) {
    const now = new Date();
    const otpAge = now - sentTime;
    const EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes
    return otpAge > EXPIRY_TIME;
  }

  /**
   * Get OTP statistics
   * @returns {Object} OTP statistics
   */
  static async getOTPStats() {
    try {
      const totalOTPs = await Otp.countDocuments();
      const verifiedOTPs = await Otp.countDocuments({ verified: true });
      const expiredOTPs = await Otp.countDocuments({
        verified: false,
        sentTime: { $lt: new Date(Date.now() - 10 * 60 * 1000) }
      });
      
      return {
        total: totalOTPs,
        verified: verifiedOTPs,
        expired: expiredOTPs,
        pending: totalOTPs - verifiedOTPs - expiredOTPs
      };
    } catch (error) {
      throw new Error(`Failed to get OTP stats: ${error.message}`);
    }
  }

  /**
   * Clean up expired OTPs
   * @returns {number} Number of OTPs cleaned up
   */
  static async cleanupExpiredOTPs() {
    try {
      const expiryTime = new Date(Date.now() - 10 * 60 * 1000);
      const result = await Otp.deleteMany({
        verified: false,
        sentTime: { $lt: expiryTime }
      });
      return result.deletedCount;
    } catch (error) {
      throw new Error(`Failed to cleanup expired OTPs: ${error.message}`);
    }
  }



  // Resend OTP email (without generating new code)
  static async resendOTPEmail(bookingId) {
    try {
      const otp = await Otp.findOne({ bookingId });
      
      if (!otp) {
        throw new Error('OTP not found for this booking');
      }

      if (this.isOTPExpired(otp.sentTime)) {
        throw new Error('OTP has expired. Please regenerate a new OTP.');
      }

      // Get user email from booking
      const Booking = require('../models/Booking');
      const booking = await Booking.findById(bookingId).populate('userId', 'email name');
      
      if (!booking || !booking.userId || !booking.userId.email) {
        throw new Error('User email not found');
      }

      // Send email
      const emailResult = await emailService.sendOTP(
        booking.userId.email, 
        otp.code, 
        bookingId
      );

      // Update OTP record
      otp.emailSent = true;
      otp.emailSentAt = new Date();
      otp.emailMessageId = emailResult.messageId;
      otp.emailError = undefined; // Clear any previous error
      await otp.save();

      return {
        success: true,
        message: 'OTP email sent successfully',
        sentTo: booking.userId.email
      };
    } catch (error) {
      console.error('Resend OTP email error:', error);
      throw new Error('Failed to resend OTP email: ' + error.message);
    }
  }

}

module.exports = OTPService;
