const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const useragent = require('express-useragent');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: true, // Allow all origins to communicate with the API
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP to prevent blocking frontend assets on some hosts
}));
app.use(morgan('dev'));
app.use(useragent.express());

// Route files
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { redirectUrl } = require('./controllers/urlController');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);
app.use('/api/analytics', analyticsRoutes);

// Redirect route
app.get('/:shortCode', redirectUrl);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
