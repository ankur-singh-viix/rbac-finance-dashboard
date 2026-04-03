const { ROLES } = require('../models/User');

/**
 * Role hierarchy — higher index = more permissions
 */
const ROLE_HIERARCHY = [ROLES.VIEWER, ROLES.ANALYST, ROLES.ADMIN];

/**
 * Returns middleware that allows access only if the user's role
 * meets or exceeds the minimum required role.
 *
 * Usage: requireRole('analyst')  → allows analyst and admin
 *        requireRole('admin')    → allows admin only
 */
const requireRole = (minimumRole) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ success: false, message: 'Unauthorized' });

    const userLevel = ROLE_HIERARCHY.indexOf(req.user.role);
    const requiredLevel = ROLE_HIERARCHY.indexOf(minimumRole);

    if (userLevel === -1 || userLevel < requiredLevel) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: requires '${minimumRole}' role or higher`,
      });
    }

    next();
  };
};

module.exports = { requireRole };