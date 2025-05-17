const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const connectDB = require('./src/config/database');
const logger = require('./src/config/logger');
const requestLogger = require('./src/middleware/requestLogger');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Hotel Service API' });
});

// API Routes
app.use('/api/hotels', require('./src/routes/hotel.routes'));
app.use('/api/rooms', require('./src/routes/room.routes'));
app.use('/api/room-types', require('./src/routes/roomType.routes'));
app.use('/api/amenities', require('./src/routes/amenity.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack
  });
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
}); 
