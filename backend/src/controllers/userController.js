const { User, ROLES } = require('../models/User');
const { validateUserCreate, validateUserUpdate } = require('../utils/validate');

const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json({ success: true, count: users.length, data: users });
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user)
    return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
};

const createUser = async (req, res) => {
  const errors = validateUserCreate(req.body);
  if (errors.length)
    return res.status(400).json({ success: false, message: 'Validation failed', errors });

  const existing = await User.findOne({ email: req.body.email.toLowerCase() });
  if (existing)
    return res.status(409).json({ success: false, message: 'Email already in use' });

  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });
  res.status(201).json({ success: true, data: user.toSafeObject() });
};

const updateUser = async (req, res) => {
  const errors = validateUserUpdate(req.body);
  if (errors.length)
    return res.status(400).json({ success: false, message: 'Validation failed', errors });

  if (req.body.isActive === false && req.params.id === req.user.id.toString())
    return res.status(400).json({ success: false, message: 'You cannot deactivate your own account' });

  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  ).select('-password');

  if (!updated)
    return res.status(404).json({ success: false, message: 'User not found' });

  res.json({ success: true, data: updated });
};

const deleteUser = async (req, res) => {
  if (req.params.id === req.user.id.toString())
    return res.status(400).json({ success: false, message: 'You cannot delete your own account' });

  const deleted = await User.findByIdAndDelete(req.params.id);
  if (!deleted)
    return res.status(404).json({ success: false, message: 'User not found' });

  res.json({ success: true, message: 'User deleted' });
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };