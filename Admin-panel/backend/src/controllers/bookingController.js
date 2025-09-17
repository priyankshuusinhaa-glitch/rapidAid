const Booking = require('../models/Booking');
const Ambulance = require('../models/Ambulance');
const OTPService = require('../services/otpService');
const emailService = require('../services/emailService');
const { calculateFare } = require('../services/fareService');
const NodeGeocoder = require('node-geocoder');

const geocoder = NodeGeocoder({ provider: 'openstreetmap' });

// Create new booking (public route)
const createBooking = async (req, res) => {
  try {
    const { userId, emergencyLevel, pickupAddress, dropAddress, overrides } = req.body;

    // Validate required fields
    if (!userId || !emergencyLevel || !pickupAddress || !dropAddress) {
      return res.status(400).json({ 
        error: 'Missing required fields: userId, emergencyLevel, pickupAddress, dropAddress' 
      });
    }

    // Geocode addresses to GeoJSON
    const [pickupGeo, dropGeo] = await Promise.all([
      geocoder.geocode(pickupAddress),
      geocoder.geocode(dropAddress)
    ]);

    if (!pickupGeo[0] || !dropGeo[0]) {
      return res.status(400).json({ error: 'Failed to geocode one or both addresses' });
    }

    const pickupLocation = {
      type: 'Point',
      coordinates: [pickupGeo[0].longitude, pickupGeo[0].latitude],
      address: pickupAddress
    };
    const dropLocation = {
      type: 'Point',
      coordinates: [dropGeo[0].longitude, dropGeo[0].latitude],
      address: dropAddress
    };

    // Haversine distance in km
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(dropGeo[0].latitude - pickupGeo[0].latitude);
    const dLon = toRad(dropGeo[0].longitude - pickupGeo[0].longitude);
    const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(pickupGeo[0].latitude)) * Math.cos(toRad(dropGeo[0].latitude)) * Math.sin(dLon/2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = Math.max(0.5, Number((R * c).toFixed(2))); // min 0.5km

    // Fare calc
    const { estimatedFare, breakdown } = await calculateFare({
      bookingId: undefined,
      distanceKm,
      emergencyLevel,
      overrides: overrides || {},
      userId
    });

    // Create new booking
    const booking = await Booking.create({
      userId,
      emergencyLevel,
      pickupLocation,
      dropLocation,
      distanceKm,
      estimatedFare,
      fareBreakdown: breakdown,
      overrides: overrides || {},
      status: 'pending'
    });

    // Generate OTP for the booking
    const otp = await OTPService.createOTP(booking._id);

    // Update booking with OTP
    booking.otp = otp.code;
    await booking.save();

    // Send OTP via email to the booking user
    try {
      const populated = await Booking.findById(booking._id).populate('userId', 'email name');
      if (populated?.userId?.email) {
        await emailService.sendOTP(populated.userId.email, otp.code, booking._id.toString());
      }
    } catch (e) {
      // Non-fatal
      console.error('Failed to send OTP email on createBooking:', e.message);
    }

    res.status(201).json({ 
      message: 'Booking created successfully', 
      booking,
      otp: otp.code,
      expiresAt: new Date(otp.sentTime.getTime() + 10 * 60 * 1000) // 10 minutes from now
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    let { page = 1, limit = 20, status, search, fromDate, toDate, plateNumber } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    
    if (status) {
      query.status = status;
    }


    if (search) {
      query.$or = [
        { _id: search },
        { otp: { $regex: search, $options: 'i' } },
      ];
    }

 
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

   
    if (plateNumber) {
      const ambulance = await Ambulance.findOne({ plateNumber: { $regex: plateNumber, $options: 'i' } });
      if (ambulance) {
        query.ambulanceId = ambulance._id;
      } else {
    
        return res.json({ bookings: [], total: 0, currentPage: page, totalPages: 0 });
      }
    }

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('userId', 'name email')
        .populate('driverId', 'name email')
        .populate('ambulanceId', 'plateNumber status')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Booking.countDocuments(query)
    ]);

    res.json({
      bookings,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const updateBookingByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp, status, driverId, ambulanceId, regenerateOtp } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

 
    if (regenerateOtp) {
      // Use OTP service to regenerate OTP
      const newOTP = await OTPService.regenerateOTP(id);
      booking.otp = newOTP.code;
    }


    if (otp) {
      booking.otp = otp;
    }

   
    if (status) {
      const allowedTransitions = {
        pending: ['assigned', 'cancelled'],
        assigned: ['enroute', 'cancelled'],
        enroute: ['arrived', 'cancelled'],
        arrived: ['in_transit', 'cancelled'],
        in_transit: ['completed', 'cancelled'],
        completed: [],
        cancelled: []
      };
      if (!allowedTransitions[booking.status]?.includes(status)) {
        return res.status(400).json({ error: `Invalid status transition from ${booking.status} to ${status}` });
      }
      booking.status = status;
    }

 
    if (driverId) {
      // If assigning a driver, ensure ambulance is not busy
      if (ambulanceId) {
        const amb = await Ambulance.findById(ambulanceId);
        if (!amb) return res.status(404).json({ error: 'Ambulance not found' });
        if (amb.status === 'busy') return res.status(400).json({ error: 'Ambulance is currently busy' });
      }
      booking.driverId = driverId;
    }

    
    if (ambulanceId) {
      const amb = await Ambulance.findById(ambulanceId);
      if (!amb) return res.status(404).json({ error: 'Ambulance not found' });
      if (amb.status === 'busy') return res.status(400).json({ error: 'Ambulance is currently busy' });
      booking.ambulanceId = ambulanceId;
      if (booking.status === 'pending') booking.status = 'assigned';
    }

    await booking.save();

    res.json({ message: 'Booking updated successfully', booking });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's own bookings
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user is requesting their own bookings
    if (req.user._id.toString() !== userId && req.user.role !== 'Manager') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const bookings = await Booking.find({ userId })
      .populate('driverId', 'name email')
      .populate('ambulanceId', 'plateNumber status')
      .sort({ createdAt: -1 });

    res.json({ bookings });

  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getBookingStats = async (req, res) => {
  try {
    const [
      totalBookings,
      pendingBookings,
      completedBookings,
      verifiedOTPBookings,
      unverifiedOTPBookings
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ otpVerified: true }),
      Booking.countDocuments({ otpVerified: { $ne: true } })
    ]);

    const otpStats = await OTPService.getOTPStats();

    res.json({
      bookingStats: {
        total: totalBookings,
        pending: pendingBookings,
        completed: completedBookings,
        otpVerified: verifiedOTPBookings,
        otpUnverified: unverifiedOTPBookings
      },
      otpStats,
      message: 'Booking statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = { createBooking, getBookings, updateBookingByAdmin, getUserBookings ,getBookingStats  };


