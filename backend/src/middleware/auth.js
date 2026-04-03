const { UserStore } = require('../models/User');

/**
 * Simulate authentication by reading x-user-id from request headers.
 * In Step 8, this will be replaced with real JWT verification.
 */
const authenticate = (req, res, next) => {
  const userId = req.headers['x-user-id'];

  if (!userId)
    return res.status(401).json({ success: false, message: 'Unauthorized: missing x-user-id header' });

  const user = UserStore.findById(userId);
  if (!user)
    return res.status(401).json({ success: false, message: 'Unauthorized: user not found' });

  if (!user.isActive)
    return res.status(403).json({ success: false, message: 'Forbidden: account is inactive' });

  req.user = user; // attach user to request
  next();
};

module.exports = { authenticate };