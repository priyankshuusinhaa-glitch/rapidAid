const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Manager+)
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '', status = '' } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) query.role = role;
    if (status) query.status = status;

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error while fetching users' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private (Manager+)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user,
      message: 'User retrieved successfully'
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Server error while fetching user' });
  }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Private (Manager+)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'User' } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create user (password will be hashed in the model)
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Create user error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation Error',
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ error: 'Server error while creating user' });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Manager+)
const updateUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if trying to update SuperAdmin role (only SuperAdmin can do this)
    if (role && role !== 'SuperAdmin' && user.role === 'SuperAdmin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ error: 'Only SuperAdmin can modify SuperAdmin users' });
    }
    
    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (status) user.status = status;
    
    const updatedUser = await user.save();
    
    res.json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status
      },
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error while updating user' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (SuperAdmin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent deletion of SuperAdmin users
    if (user.role === 'SuperAdmin') {
      return res.status(403).json({ error: 'Cannot delete SuperAdmin users' });
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    await user.deleteOne();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error while deleting user' });
  }
};

// @desc    Block/Unblock user
// @route   PATCH /api/users/:id/status
// @access  Private (Manager+)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent blocking SuperAdmin users
    if (user.role === 'SuperAdmin' && req.user.role !== 'SuperAdmin') {
      return res.status(403).json({ error: 'Only SuperAdmin can block SuperAdmin users' });
    }

    // Prevent self-blocking
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot block your own account' });
    }
    
    user.status = user.status === 'active' ? 'blocked' : 'active';
    await user.save();
    
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      },
      message: `User ${user.status === 'active' ? 'activated' : 'blocked'} successfully`
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ error: 'Server error while updating user status' });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats/overview
// @access  Private (Manager+)
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const blockedUsers = await User.countDocuments({ status: 'blocked' });
    
    const roleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      stats: {
        total: totalUsers,
        active: activeUsers,
        blocked: blockedUsers,
        roles: roleStats
      },
      message: 'User statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Server error while fetching user statistics' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserStats
};
