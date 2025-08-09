const express = require('express');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus
} = require('../controllers/userController');
const auth = require('../middlewares/auth');
const { isManager } = require('../middlewares/role');

const router = express.Router();

// All routes require authentication
router.use(auth);


router.get('/', isManager, getUsers);


router.get('/:id', isManager, getUserById);


router.put('/:id', isManager, updateUser);

router.delete('/:id', deleteUser);

router.patch('/:id/status', isManager, toggleUserStatus);

module.exports = router;
