// models/Otp.js - Updated with Email Fields
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true // Ensure one OTP per booking
  },
  code: {
    type: String,
    required: true,
    length: 6
  },
  sentTime: {
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedAt: {
    type: Date
  },
  // Email-related fields
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: {
    type: Date
  },
  emailMessageId: {
    type: String // Store email provider's message ID for tracking
  },
  emailError: {
    type: String // Store error message if email sending fails
  },
  emailRetryCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'otps'
});

// Index for efficient queries
otpSchema.index({ bookingId: 1 });
otpSchema.index({ sentTime: 1 });
otpSchema.index({ verified: 1 });
otpSchema.index({ emailSent: 1 });

// Auto-expire OTPs after 15 minutes (cleanup safety buffer)
otpSchema.index({ sentTime: 1 }, { expireAfterSeconds: 900 });

// Virtual to check if OTP is expired
otpSchema.virtual('isExpired').get(function() {
  const now = new Date();
  const diffInMinutes = (now - this.sentTime) / (1000 * 60);
  return diffInMinutes > 10; // 10 minutes expiry
});

// Instance method to check if OTP is valid
otpSchema.methods.isValid = function() {
  return !this.verified && !this.isExpired;
};

// Static method to find valid OTP
otpSchema.statics.findValidOTP = function(bookingId, code) {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  return this.findOne({
    bookingId,
    code,
    verified: false,
    sentTime: { $gte: tenMinutesAgo }
  });
};

// Static method to cleanup expired OTPs
otpSchema.statics.cleanupExpired = function() {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  return this.deleteMany({
    verified: false,
    sentTime: { $lt: tenMinutesAgo }
  });
};

module.exports = mongoose.model('OTP', otpSchema);