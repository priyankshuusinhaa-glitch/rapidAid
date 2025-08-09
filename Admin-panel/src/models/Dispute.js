const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  issueType: { type: String, required: true },
  description: { type: String, required: true },
  resolved: { type: Boolean, default: false },
  comments: [{
    text: String,
    createdAt: { type: Date, default: Date.now },
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);
