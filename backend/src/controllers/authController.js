const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, ROLES } = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'name, email and password are required' });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'password must be at least 6 characters' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ success: false, message: 'Email already in use' });

    if (role && !Object.values(ROLES).includes(role))
      return res.status(400).json({ success: false, message: `role must be one of: ${Object.values(ROLES).join(', ')}` });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    const safe = user.toSafeObject ? user.toSafeObject() : user;
    res.status(201).json({
      success: true,
      data: { token: generateToken(user._id || user.id), user: safe },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    // Support both bcrypt hashed and plain text passwords (for seeded admin)
    let isMatch = false;
    if (user.password.startsWith('$2')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
    }

    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: 'Account is inactive' });

    const safe = user.toSafeObject ? user.toSafeObject() : user;
    res.json({
      success: true,
      data: { token: generateToken(user._id || user.id), user: safe },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  const safe = req.user.toSafeObject ? req.user.toSafeObject() : req.user;
  res.json({ success: true, data: safe });
};

module.exports = { register, login, getMe };