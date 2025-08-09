const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  ambulanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance' },
  emergencyLevel: { type: String, enum: ['Critical', 'Medium', 'Low'], required: true },
  fare: { type: Number, required: true },
  otp: { type: String },
  status: { type: String, enum: ['pending', 'assigned', 'completed', 'cancelled'], default: 'pending' },
  pickupLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  dropLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
