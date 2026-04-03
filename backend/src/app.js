const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware — MUST come before any routes
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Finance Dashboard API is running',
    version: '1.0.0',
  });
});

// Temporary login stub — replaced by JWT in Step 8
const { UserStore } = require('./models/User');
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'email and password required' });

  const user = UserStore.findByEmail(email);
  if (!user || user.password !== password)
    return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const { password: _, ...safe } = user;
  res.json({ success: true, data: { userId: user.id, user: safe } });
});

// Seed a default admin on startup (in-memory only)
UserStore.create({
  name: 'Super Admin',
  email: 'admin@test.com',
  password: 'admin123',
  role: 'admin',
});

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const recordRoutes = require('./routes/recordRoutes');
app.use('/api/records', recordRoutes);

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;