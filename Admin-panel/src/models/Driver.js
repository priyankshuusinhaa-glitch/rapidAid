const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  status: { type: String, enum: ['online', 'offline', 'blocked'], default: 'offline' },
  ambulanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ambulance' },
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
