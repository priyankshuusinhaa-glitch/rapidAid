const Booking = require('../models/Booking');
const Driver = require('../models/Driver');

// Helpers
function dateRange(filter) {
  const now = new Date();
  let start;
  if (filter === 'day') start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  else if (filter === 'week') {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    start = new Date(now.getFullYear(), now.getMonth(), diff);
  } else if (filter === 'month') start = new Date(now.getFullYear(), now.getMonth(), 1);
  else start = new Date(0);
  return { start, end: now };
}

// Booking analytics
const bookingAnalytics = async (req, res) => {
  try {
    const { range = 'month' } = req.query;
    const { start, end } = dateRange(range);

    const data = await Booking.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: {
            y: { $year: '$createdAt' },
            m: { $month: '$createdAt' },
            d: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } },
    ]);

    res.json({ data });
  } catch (error) {
    console.error('Booking analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Revenue analytics
const revenueAnalytics = async (req, res) => {
  try {
    const { range = 'month' } = req.query;
    const { start, end } = dateRange(range);

    const data = await Booking.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end }, paymentStatus: 'paid' } },
      {
        $group: {
          _id: {
            y: { $year: '$createdAt' },
            m: { $month: '$createdAt' },
            d: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: { $ifNull: ['$finalFare', '$estimatedFare'] } },
        },
      },
      { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } },
    ]);

    res.json({ data });
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Driver performance
const driverPerformance = async (req, res) => {
  try {
    const { range = 'month' } = req.query;
    const { start, end } = dateRange(range);

    const data = await Booking.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end }, status: 'completed' } },
      {
        $group: {
          _id: '$driverId',
          completed: { $sum: 1 },
          totalRevenue: { $sum: { $ifNull: ['$finalFare', '$estimatedFare'] } },
          totalDistance: { $sum: { $ifNull: ['$distanceKm', 0] } },
        },
      },
      { $sort: { completed: -1 } },
      { $limit: 20 },
    ]);

    const withDriver = await Driver.populate(data, { path: '_id', select: 'name email status' });
    res.json({ data: withDriver });
  } catch (error) {
    console.error('Driver performance error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Emergency level stats
const emergencyStats = async (req, res) => {
  try {
    const data = await Booking.aggregate([
      {
        $group: {
          _id: '$emergencyLevel',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({ data });
  } catch (error) {
    console.error('Emergency stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Heatmap data
const bookingHeatmap = async (req, res) => {
  try {
    const { range = 'month' } = req.query;
    const { start, end } = dateRange(range);

    const data = await Booking.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end }, pickupLocation: { $exists: true } } },
      {
        $project: {
          _id: 0,
          type: { $literal: 'Feature' },
          geometry: '$pickupLocation',
          properties: {
            status: '$status',
            emergencyLevel: '$emergencyLevel',
          },
        },
      },
    ]);

    res.json({ type: 'FeatureCollection', features: data });
  } catch (error) {
    console.error('Heatmap error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { bookingAnalytics, revenueAnalytics, driverPerformance, emergencyStats, bookingHeatmap };
