const Driver = require('../models/Driver');
const Ambulance = require('../models/Ambulance');
const Booking = require('../models/Booking'); // ✅ Added for performance stats

// ================================
// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private (Manager+)
// ================================
const getDrivers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) query.status = status;

    const drivers = await Driver.find(query)
      .populate('ambulanceId', 'plateNumber status')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Driver.countDocuments(query);

    res.json({
      drivers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================================
// @desc    Get driver by ID
// @route   GET /api/drivers/:id
// @access  Private (Manager+)
// ================================
const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id)
      .populate('ambulanceId', 'plateNumber status currentLocation');

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================================
// @desc    Create new driver
// @route   POST /api/drivers
// @access  Private (Manager+)
// ================================
const createDriver = async (req, res) => {
  try {
    const { name, email, ambulanceId } = req.body;

    const driverExists = await Driver.findOne({ email });
    if (driverExists) {
      return res.status(400).json({ error: 'Driver already exists' });
    }

    if (ambulanceId) {
      const ambulance = await Ambulance.findById(ambulanceId);
      if (!ambulance) {
        return res.status(404).json({ error: 'Ambulance not found' });
      }
    }

    const driver = await Driver.create({ name, email, ambulanceId });
    const populatedDriver = await driver.populate('ambulanceId', 'plateNumber status');

    res.status(201).json(populatedDriver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================================
// @desc    Update driver
// @route   PUT /api/drivers/:id
// @access  Private (Manager+)
// ================================
const updateDriver = async (req, res) => {
  try {
    const { name, email, status, ambulanceId } = req.body;

    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    driver.name = name || driver.name;
    driver.email = email || driver.email;
    driver.status = status || driver.status;
    driver.ambulanceId = ambulanceId || driver.ambulanceId;

    const updatedDriver = await driver.save();
    const populatedDriver = await updatedDriver.populate('ambulanceId', 'plateNumber status');

    res.json(populatedDriver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================================
// @desc    Delete driver
// @route   DELETE /api/drivers/:id
// @access  Private (Manager+)
// ================================
const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    if (driver.ambulanceId) {
      await Ambulance.findByIdAndUpdate(driver.ambulanceId, { driverId: null });
    }

    await driver.deleteOne();
    res.json({ message: 'Driver removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================================
// @desc    Toggle driver status (online/offline)
// @route   PATCH /api/drivers/:id/status
// @access  Private (Manager+)
// ================================
const toggleDriverStatus = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    driver.status = driver.status === 'online' ? 'offline' : 'online';
    await driver.save();

    const populatedDriver = await driver.populate('ambulanceId', 'plateNumber status');
    res.json(populatedDriver);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================================
// @desc    Get driver performance
// @route   GET /api/drivers/:id/performance
// @access  Private (Manager+)
// ================================
const getDriverPerformance = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Fetch bookings for performance
    const bookings = await Booking.find({ driverId: driver._id, status: { $in: ['completed', 'cancelled'] } });

    const completedTrips = bookings.filter(b => b.status === 'completed').length;
    const cancelledTrips = bookings.filter(b => b.status === 'cancelled').length;
    const totalTrips = bookings.length;

    const totalEarnings = bookings
      .filter(b => b.status === 'completed' && b.finalFare)
      .reduce((sum, b) => sum + b.finalFare, 0);

    const avgDistance =
      bookings.length > 0
        ? bookings.reduce((sum, b) => sum + (b.distanceKm || 0), 0) / bookings.length
        : 0;

    const performance = {
      driverId: driver._id,
      name: driver.name,
      status: driver.status,
      totalTrips,
      completedTrips,
      cancelledTrips,
      totalEarnings,
      avgDistance: avgDistance.toFixed(2),
      completionRate: totalTrips > 0 ? ((completedTrips / totalTrips) * 100).toFixed(1) + '%' : '0%',
    };

    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  toggleDriverStatus,
  getDriverPerformance
};
