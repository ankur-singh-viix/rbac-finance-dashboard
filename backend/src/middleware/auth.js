const { User } = require('../models/User');

const authenticate = async (req, res, next) => {
  const userId = req.headers['x-user-id'];

  if (!userId)
    return res.status(401).json({ success: false, message: 'Unauthorized: missing x-user-id header' });

  try {
    const user = await User.findById(userId);
    if (!user)
      return res.status(401).json({ success: false, message: 'Unauthorized: user not found' });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: 'Forbidden: account is inactive' });

    req.user = user;
    next();
  } catch (err) {
    // Invalid ObjectId format
    return res.status(401).json({ success: false, message: 'Unauthorized: invalid user id' });
  }
};

module.exports = { authenticate };