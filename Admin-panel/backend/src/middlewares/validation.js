const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// User registration validation
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('role')
    .optional()
    .isIn(['SuperAdmin', 'Manager', 'HelplineOperator', 'Dispatcher', 'User', 'Driver'])
    .withMessage('Invalid role specified'),
  // Driver-specific validation
  body('driverLicense')
    .optional()
    .isString()
    .withMessage('Driver license must be a string'),
  body('vehicleRegistration')
    .optional()
    .isString()
    .withMessage('Vehicle registration must be a string'),
  body('emergencyContactName')
    .optional()
    .isString()
    .withMessage('Emergency contact name must be a string'),
  body('emergencyContactPhone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Emergency contact phone must be a valid phone number'),
  validate
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

// User update validation
const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['SuperAdmin', 'Manager', 'HelplineOperator', 'Dispatcher', 'User', 'Driver'])
    .withMessage('Invalid role specified'),
  body('status')
    .optional()
    .isIn(['active', 'blocked'])
    .withMessage('Invalid status specified'),
  validate
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  validate
];

module.exports = {
  validate,
  validateRegistration,
  validateLogin,
  validateUserUpdate,
  validatePasswordChange
};
