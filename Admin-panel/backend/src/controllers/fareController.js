const Booking = require('../models/Booking');
const FareHistory = require('../models/FareHistory');
const { calculateFare } = require('../services/fareService');

// Calculate fare
const calculate = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { distanceKm, overrides } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const result = await calculateFare({
      bookingId,
      distanceKm,
      emergencyLevel: booking.emergencyLevel,
      overrides,
      userId: req.user._id,
    });

    booking.distanceKm = distanceKm;
    booking.estimatedFare = result.estimatedFare;
    booking.fareBreakdown = result.breakdown;
    await booking.save();

    res.json({
      estimatedFare: booking.estimatedFare,
      fareBreakdown: booking.fareBreakdown,
      message: 'Fare calculated successfully',
    });
  } catch (error) {
    console.error('Fare calculation error:', error);
    res.status(500).json({ error: 'Server error while calculating fare' });
  }
};

// Override fare
const overrideFare = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { finalFare, reason } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    await FareHistory.create({
      bookingId,
      calculatedBy: req.user._id,
      estimatedFare: booking.estimatedFare,
      finalFare,
      overrideReason: reason,
      context: booking.fareBreakdown,
    });

    booking.finalFare = finalFare;
    booking.fareOverriddenBy = req.user._id;
    booking.fareOverrideReason = reason;
    await booking.save();

    res.json({ message: 'Fare overridden successfully', finalFare: booking.finalFare });
  } catch (error) {
    console.error('Fare override error:', error);
    res.status(500).json({ error: 'Server error while overriding fare' });
  }
};

// Update payment status
const updatePayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentStatus, paymentMethod } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (paymentMethod) booking.paymentMethod = paymentMethod;
    await booking.save();

    res.json({ message: 'Payment updated', paymentStatus: booking.paymentStatus, paymentMethod: booking.paymentMethod });
  } catch (error) {
    console.error('Payment update error:', error);
    res.status(500).json({ error: 'Server error while updating payment' });
  }
};

// Get fare history for a booking
const history = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const records = await FareHistory.find({ bookingId }).sort({ createdAt: -1 });
    res.json({ history: records });
  } catch (error) {
    console.error('Fare history error:', error);
    res.status(500).json({ error: 'Server error while fetching fare history' });
  }
};

module.exports = { calculate, overrideFare, updatePayment, history };
