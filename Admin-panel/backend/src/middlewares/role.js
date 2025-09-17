const { roles } = require('../config/roles');

const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

const isSuperAdmin = checkRole(roles.SUPERADMIN);
const isManager = checkRole(roles.SUPERADMIN, roles.MANAGER);
const isHelplineOperator = checkRole(roles.SUPERADMIN, roles.MANAGER, roles.HELPLINE_OPERATOR);
const isDispatcher = checkRole(roles.SUPERADMIN, roles.MANAGER, roles.DISPATCHER);

module.exports = {
  checkRole,
  isSuperAdmin,
  isManager,
  isHelplineOperator,
  isDispatcher,
};
