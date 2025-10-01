const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const hotelSchema = new mongoose.Schema({
  document_id: {
    type: String,
    default: () => uuidv4(),
    unique: true,
    required: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    default: "Không có mô tả"
  },
  region: {
    type: String,
    required: true,
    trim: true
  },
  starRating: {
    type: String,
    required: true,
    default: "3.0"
  },
  userRating: {
    type: String,
    required: true,
    default: "0"
  },
  numReviews: {
    type: String,
    required: true,
    default: "0"
  },
  userRatingInfo: {
    type: String,
    required: true,
    default: "Chưa có đánh giá"
  },
  latitude: {
    type: String,
    required: true
  },
  longitude: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true,
    default: "0"
  },
  imageUrl: {
    type: String,
    required: true,
    default: "default.webp"
  },
  imageUrls: [{
    type: String,
    required: true
  }],
  hotelFeatures: [{
    type: String,
    required: true
  }],
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
hotelSchema.index({ displayName: 1 });
hotelSchema.index({ description: 1 });
hotelSchema.index({ region: 1 });
hotelSchema.index({ starRating: 1 });
hotelSchema.index({ userRating: 1 });
hotelSchema.index({ price: 1 });
hotelSchema.index({ is_active: 1 });

// Compound index for search optimization
hotelSchema.index({
  displayName: 'text',
  description: 'text',
  region: 'text',
  hotelFeatures: 'text'
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel; 
