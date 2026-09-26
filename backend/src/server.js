require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Bulletproof CORS configuration for production (Vercel, Render) and local environments
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server, Postman) or any web origin
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root / Health Check Endpoints
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Freelance Market Hub API Server is running',
    timestamp: new Date().toISOString()
  });
});

app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Freelance Market Hub API is running with MongoDB Atlas!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      jobs: '/api/jobs',
      proposals: '/api/proposals',
      contracts: '/api/contracts',
      freelancers: '/api/freelancers',
      messages: '/api/messages',
      reviews: '/api/reviews',
      notifications: '/api/notifications',
      analytics: '/api/analytics'
    }
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/proposals', require('./routes/proposalRoutes'));
app.use('/api/contracts', require('./routes/contractRoutes'));
app.use('/api/freelancers', require('./routes/freelancerRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`
  });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Server Global Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Freelance Market Hub Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

