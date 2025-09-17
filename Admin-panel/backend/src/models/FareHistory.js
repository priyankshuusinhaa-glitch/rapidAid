const mongoose = require('mongoose');

const fareHistorySchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  calculatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  context: {
    distanceKm: Number,
    emergencyLevel: String,
    baseFare: Number,
    perKmRate: Number,
    emergencyMultiplier: Number,
  },
  estimatedFare: { type: Number, required: true },
  finalFare: { type: Number },
  overrideReason: { type: String },
}, { timestamps: true });

fareHistorySchema.index({ bookingId: 1, createdAt: -1 });

module.exports = mongoose.model('FareHistory', fareHistorySchema);
