const express = require('express');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserStats
} = require('../controllers/userController');
const auth = require('../middlewares/auth');
const { isManager, isSuperAdmin } = require('../middlewares/role');
const { validateUserUpdate } = require('../middlewares/validation');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/users
// @desc    Get all users with pagination and search
// @access  Private (Manager+)
router.get('/', isManager, getUsers);

// @route   GET /api/users/stats/overview
// @desc    Get user statistics
// @access  Private (Manager+)
router.get('/stats/overview', isManager, getUserStats);

// @route   POST /api/users
// @desc    Create new user
// @access  Private (Manager+)
router.post('/', isManager, createUser);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Manager+)
router.get('/:id', isManager, getUserById);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Manager+)
router.put('/:id', isManager, validateUserUpdate, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (SuperAdmin only)
router.delete('/:id', isSuperAdmin, deleteUser);

// @route   PATCH /api/users/:id/status
// @desc    Toggle user status (block/unblock)
// @access  Private (Manager+)
router.patch('/:id/status', isManager, toggleUserStatus);

module.exports = router;
