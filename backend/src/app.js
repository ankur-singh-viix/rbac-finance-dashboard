const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Finance Dashboard API is running', version: '1.0.0' });
});

// Temporary login stub — replaced by JWT in Step 8
app.post('/api/auth/login', async (req, res) => {
  try {
    const { User } = require('./models/User');
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.password !== password)
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const safe = user.toSafeObject();
    res.json({ success: true, data: { userId: user._id, user: safe } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Routes
const userRoutes = require('./routes/userRoutes');
const recordRoutes = require('./routes/recordRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Centralized error handler (must be last)
app.use(errorHandler);

// Seed default admin after DB connects
const seedAdmin = async () => {
  try {
    const { User, ROLES } = require('./models/User');
    const count = await User.countDocuments();
    if (count === 0) {
      await User.create({
        name: 'Super Admin',
        email: 'admin@test.com',
        password: 'admin123',
        role: ROLES.ADMIN,
      });
      console.log('Seeded default admin → admin@test.com / admin123');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

// Start server — connect DB first, then seed
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();      // wait for mongo to connect
  await seedAdmin();      // then seed
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();

module.exports = app;