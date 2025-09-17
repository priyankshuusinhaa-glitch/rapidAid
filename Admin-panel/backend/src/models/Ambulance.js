const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  plateNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' },
  currentLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
  },
}, { timestamps: true });

ambulanceSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Ambulance', ambulanceSchema);
