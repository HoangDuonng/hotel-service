const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const connectDB = require('./src/config/database');
const logger = require('./src/config/logger');
const requestLogger = require('./src/middleware/requestLogger');
const corsOptions = require('./src/config/cors');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
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

const { errorResponse } = require('./src/utils/responseHelper');

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack
  });
  errorResponse(res, 'Có lỗi xảy ra trong hệ thống');
});

const PORT = process.env.PORT || 8083;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
}); 
