const { UserStore, ROLES } = require('../models/User');

// GET /api/users
const getAllUsers = (req, res) => {
  const allUsers = UserStore.getAll().map(({ password, ...u }) => u);
  res.json({ success: true, data: allUsers });
};

// GET /api/users/:id
const getUserById = (req, res) => {
  const user = UserStore.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const { password, ...safe } = user;
  res.json({ success: true, data: safe });
};

// POST /api/users
const createUser = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'name, email, and password are required' });

  if (role && !Object.values(ROLES).includes(role))
    return res.status(400).json({ success: false, message: `role must be one of: ${Object.values(ROLES).join(', ')}` });

  if (UserStore.findByEmail(email))
    return res.status(409).json({ success: false, message: 'Email already in use' });

  const user = UserStore.create({ name, email, password, role });
  const { password: _, ...safe } = user;
  res.status(201).json({ success: true, data: safe });
};

// PATCH /api/users/:id
const updateUser = (req, res) => {
  const { role, isActive, name } = req.body;

  if (role && !Object.values(ROLES).includes(role))
    return res.status(400).json({ success: false, message: `Invalid role` });

  const updated = UserStore.update(req.params.id, { name, role, isActive });
  if (!updated) return res.status(404).json({ success: false, message: 'User not found' });

  const { password, ...safe } = updated;
  res.json({ success: true, data: safe });
};

// DELETE /api/users/:id
const deleteUser = (req, res) => {
  const deleted = UserStore.delete(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, message: 'User deleted' });
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };