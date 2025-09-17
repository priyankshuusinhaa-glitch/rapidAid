const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  ambulanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance' },
  emergencyLevel: { type: String, enum: ['Critical', 'Medium', 'Low'], required: true },

  // Fare fields
  estimatedFare: { type: Number },
  finalFare: { type: Number },
  fareBreakdown: {
    baseFare: { type: Number },
    perKmRate: { type: Number },
    emergencyMultiplier: { type: Number },
  },

  // Distance
  distanceKm: { type: Number },

  // Payment
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
  paymentMethod: { type: String, enum: ['cash', 'card', 'online'], default: 'cash' },

  // OTP
  otp: { type: String },
  otpVerified: { type: Boolean, default: false },

  // Status lifecycle
  status: { 
    type: String, 
    enum: ['pending', 'assigned', 'enroute', 'arrived', 'in_transit', 'completed', 'cancelled'], 
    default: 'pending' 
  },

  // GeoJSON + optional formatted address for UX
  pickupLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
    address: { type: String }
  },
  dropLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
    address: { type: String }
  },

  // Admin overrides when needed
  overrides: {
    baseFare: { type: Number },
    perKmRate: { type: Number },
    emergencyMultiplier: { type: Number },
  }
}, { timestamps: true });

bookingSchema.index({ pickupLocation: '2dsphere' });
bookingSchema.index({ dropLocation: '2dsphere' });

module.exports = mongoose.model('Booking', bookingSchema);
