const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtConfig = require('../config/jwt');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    const { name, email, password, role = 'User' } = req.body;

    // Check if user exists
    console.log('Checking if user exists with email:', email);
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User already exists');
      return res.status(400).json({ error: 'User already exists' });
    }
    console.log('User does not exist, proceeding with creation');

    // Create user (password will be hashed automatically in the model)
    const userData = {
      name,
      email,
      password,
      role,
      phone: req.body.phone
    };

    // Add driver-specific fields if registering as driver
    if (role === 'Driver') {
      userData.driverLicense = req.body.driverLicense;
      userData.vehicleRegistration = req.body.vehicleRegistration;
      userData.emergencyContactName = req.body.emergencyContactName;
      userData.emergencyContactPhone = req.body.emergencyContactPhone;
    }

    console.log('Creating user with data:', userData);
    const user = await User.create(userData);

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        driverLicense: user.driverLicense,
        vehicleRegistration: user.vehicleRegistration,
        emergencyContactName: user.emergencyContactName,
        emergencyContactPhone: user.emergencyContactPhone,
        token: generateToken(user._id),
        message: 'User registered successfully'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Use the new findByCredentials method
    const user = await User.findByCredentials(email, password);

    // Check if user is blocked
    if (user.status === 'blocked') {
      return res.status(403).json({ error: 'Account is blocked. Please contact administrator.' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token: generateToken(user._id),
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error.message.includes('Invalid login credentials')) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (error.message.includes('Account is temporarily locked')) {
      return res.status(423).json({ error: 'Account is temporarily locked due to too many failed login attempts. Please try again later.' });
    }
    res.status(500).json({ error: 'Server error during login' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      user,
      message: 'User profile retrieved successfully'
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password using the model method
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password (will be hashed automatically)
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Server error while changing password' });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
const refreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ error: 'Account is blocked' });
    }

    const newToken = generateToken(user._id);
    res.json({
      token: newToken,
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Server error while refreshing token' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Server error during logout' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  changePassword,
  refreshToken,
  logout
};
