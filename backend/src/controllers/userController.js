const { UserStore, ROLES } = require('../models/User');
const { validateUserCreate, validateUserUpdate } = require('../utils/validate');

const getAllUsers = (req, res) => {
  const allUsers = UserStore.getAll().map(({ password, ...u }) => u);
  res.json({ success: true, count: allUsers.length, data: allUsers });
};

const getUserById = (req, res) => {
  const user = UserStore.findById(req.params.id);
  if (!user)
    return res.status(404).json({ success: false, message: 'User not found' });
  const { password, ...safe } = user;
  res.json({ success: true, data: safe });
};

const createUser = (req, res) => {
  const errors = validateUserCreate(req.body);
  if (errors.length)
    return res.status(400).json({ success: false, message: 'Validation failed', errors });

  if (UserStore.findByEmail(req.body.email))
    return res.status(409).json({ success: false, message: 'Email already in use' });

  const { name, email, password, role } = req.body;
  const user = UserStore.create({ name, email, password, role });
  const { password: _, ...safe } = user;
  res.status(201).json({ success: true, data: safe });
};

const updateUser = (req, res) => {
  const errors = validateUserUpdate(req.body);
  if (errors.length)
    return res.status(400).json({ success: false, message: 'Validation failed', errors });

  // Prevent admin from deactivating their own account
  if (req.body.isActive === false && req.params.id === req.user.id)
    return res.status(400).json({ success: false, message: 'You cannot deactivate your own account' });

  const updated = UserStore.update(req.params.id, req.body);
  if (!updated)
    return res.status(404).json({ success: false, message: 'User not found' });

  const { password, ...safe } = updated;
  res.json({ success: true, data: safe });
};

const deleteUser = (req, res) => {
  if (req.params.id === req.user.id)
    return res.status(400).json({ success: false, message: 'You cannot delete your own account' });

  const deleted = UserStore.delete(req.params.id);
  if (!deleted)
    return res.status(404).json({ success: false, message: 'User not found' });

  res.json({ success: true, message: 'User deleted' });
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };