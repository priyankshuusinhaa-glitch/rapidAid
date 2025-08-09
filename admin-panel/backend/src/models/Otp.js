const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  code: { type: String, required: true },
  sentTime: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Otp', otpSchema);
