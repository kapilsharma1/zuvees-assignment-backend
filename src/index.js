const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

// Load environment variables
dotenv.config();

// Initialize Firebase Admin
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://zuvees-assignment-frontend.netlify.app',
    process.env.FRONTEND_URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${req.method}] ${req.path}`);
  next();
});

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/riders', require('./routes/riders'));
app.use('/api/approved-emails', require('./routes/approvedEmails'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler - must be after all other routes
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 