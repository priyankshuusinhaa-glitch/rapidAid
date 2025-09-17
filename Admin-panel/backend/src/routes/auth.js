const express = require('express');
const { 
  register, 
  login, 
  getMe, 
  changePassword, 
  refreshToken, 
  logout 
} = require('../controllers/authController');
const auth = require('../middlewares/auth');
const { 
  validateRegistration, 
  validateLogin, 
  validatePasswordChange 
} = require('../middlewares/validation');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', validateRegistration, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, getMe);

// @route   PUT /api/auth/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', auth, validatePasswordChange, changePassword);

// @route   POST /api/auth/refresh
// @desc    Refresh token
// @access  Private
router.post('/refresh', auth, refreshToken);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', auth, logout);

module.exports = router;
