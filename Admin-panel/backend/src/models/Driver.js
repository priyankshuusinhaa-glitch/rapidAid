const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  licenseNumber: { type: String },
  experienceYears: { type: Number, default: 0 },

  status: { 
    type: String, 
    enum: ['online', 'offline', 'blocked', 'unavailable'], 
    default: 'offline' 
  },

  ambulanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance' },

  // 🔹 Performance & Earnings
  totalTrips: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },

  // 🔹 Emergency contact info
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    relation: { type: String },
  },

  // 🔹 Driver documents / verification (optional but useful)
  isVerified: { type: Boolean, default: false },
  licenseExpiry: { type: Date },
}, 
{ timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
