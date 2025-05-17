const winston = require('winston');
const path = require('path');
require('dotenv').config();

// Log directory
const logDir = 'logs';

// Log file size limits (in bytes)
const MAX_FILE_SIZE = process.env.MAX_LOG_FILE_SIZE || 5 * 1024 * 1024; // Default 5MB
const MAX_FILES = process.env.MAX_LOG_FILES || 5; // Default 5 files

// Create logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'hotel-service' },
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: MAX_FILE_SIZE,
      maxFiles: MAX_FILES,
      tailable: true
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: MAX_FILE_SIZE,
      maxFiles: MAX_FILES,
      tailable: true
    })
  ]
});

// If we're not in production, also log to the console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger; 
