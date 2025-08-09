const Ambulance = require('../models/Ambulance');
const Driver = require('../models/Driver');

// @desc    Get all ambulances
// @route   GET /api/ambulances
// @access  Private (Manager+)
const getAmbulances = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', search = '' } = req.query;
    
    const query = {};
    
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { plateNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const ambulances = await Ambulance.find(query)
      .populate('driverId', 'name email status')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Ambulance.countDocuments(query);

    res.json({
      ambulances,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get ambulance by ID
// @route   GET /api/ambulances/:id
// @access  Private (Manager+)
const getAmbulanceById = async (req, res) => {
  try {
    const ambulance = await Ambulance.findById(req.params.id)
      .populate('driverId', 'name email status');
    
    if (!ambulance) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }
    
    res.json(ambulance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create ambulance
// @route   POST /api/ambulances
// @access  Private (Manager+)
const createAmbulance = async (req, res) => {
  try {
    const { plateNumber, driverId, currentLocation } = req.body;
    
    // Check if ambulance already exists
    const ambulanceExists = await Ambulance.findOne({ plateNumber });
    if (ambulanceExists) {
      return res.status(400).json({ error: 'Ambulance with this plate number already exists' });
    }
    
    // Check if driver exists
    if (driverId) {
      const driver = await Driver.findById(driverId);
      if (!driver) {
        return res.status(404).json({ error: 'Driver not found' });
      }
    }
    
    const ambulance = await Ambulance.create({
      plateNumber,
      driverId,
      currentLocation
    });
    
    const populatedAmbulance = await ambulance.populate('driverId', 'name email status');
    
    res.status(201).json(populatedAmbulance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update ambulance
// @route   PUT /api/ambulances/:id
// @access  Private (Manager+)
const updateAmbulance = async (req, res) => {
  try {
    const { plateNumber, driverId, status, currentLocation } = req.body;
    
    const ambulance = await Ambulance.findById(req.params.id);
    
    if (!ambulance) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }
    
    ambulance.plateNumber = plateNumber || ambulance.plateNumber;
    ambulance.driverId = driverId || ambulance.driverId;
    ambulance.status = status || ambulance.status;
    ambulance.currentLocation = currentLocation || ambulance.currentLocation;
    
    const updatedAmbulance = await ambulance.save();
    const populatedAmbulance = await updatedAmbulance.populate('driverId', 'name email status');
    
    res.json(populatedAmbulance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete ambulance
// @route   DELETE /api/ambulances/:id
// @access  Private (Manager+)
const deleteAmbulance = async (req, res) => {
  try {
    const ambulance = await Ambulance.findById(req.params.id);
    
    if (!ambulance) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }
    
    // If ambulance has a driver, unassign the driver
    if (ambulance.driverId) {
      await Driver.findByIdAndUpdate(ambulance.driverId, { ambulanceId: null });
    }
    
    await ambulance.deleteOne();
    
    res.json({ message: 'Ambulance removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update ambulance location (for live tracking)
// @route   PATCH /api/ambulances/:id/location
// @access  Private (Driver)
const updateAmbulanceLocation = async (req, res) => {
  try {
    const { currentLocation } = req.body;
    
    const ambulance = await Ambulance.findById(req.params.id);
    
    if (!ambulance) {
      return res.status(404).json({ error: 'Ambulance not found' });
    }
    
    ambulance.currentLocation = currentLocation;
    await ambulance.save();
    
    // TODO: Emit socket event for real-time updates
    // io.emit('ambulanceLocationUpdate', { ambulanceId: ambulance._id, location: currentLocation });
    
    res.json(ambulance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get available ambulances
// @route   GET /api/ambulances/available
// @access  Private (Dispatcher+)
const getAvailableAmbulances = async (req, res) => {
  try {
    const ambulances = await Ambulance.find({ status: 'available' })
      .populate('driverId', 'name email status')
      .sort({ createdAt: -1 });
    
    res.json(ambulances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get ambulances by region (for filtering)
// @route   GET /api/ambulances/region
// @access  Private (Dispatcher+)
const getAmbulancesByRegion = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query; // maxDistance in meters
    
    const ambulances = await Ambulance.find({
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      status: 'available'
    }).populate('driverId', 'name email status');
    
    res.json(ambulances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAmbulances,
  getAmbulanceById,
  createAmbulance,
  updateAmbulance,
  deleteAmbulance,
  updateAmbulanceLocation,
  getAvailableAmbulances,
  getAmbulancesByRegion
};
