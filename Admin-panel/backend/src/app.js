const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'RapidAid backend running' });
});

// Mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/ambulances', require('./routes/ambulances'));
app.use('/api/fares', require('./routes/fares'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/booking', require('./routes/booking'));
app.use('/api/otp', require('./routes/otp'));

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
