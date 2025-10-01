const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const hotelSchema = new mongoose.Schema({
  document_id: {
    type: String,
    default: () => uuidv4(),
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  thumbnail: {
    type: String,
    required: true,
    default: 'default-hotel-thumbnail.jpg'
  },
  detail_images: [{
    type: String,
    required: true
  }],
  address: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    postal_code: {
      type: String,
      required: true,
      trim: true
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], 
      required: true,
      index: '2dsphere'
    }
  },
  contact: {
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  amenities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Amenity'
  }],
  star_rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
hotelSchema.index({ name: 1 });
hotelSchema.index({ 'address.city': 1 });
hotelSchema.index({ 'address.country': 1 });
hotelSchema.index({ star_rating: 1 });
hotelSchema.index({ is_active: 1 });

// Compound index for search optimization
hotelSchema.index({
  name: 'text',
  description: 'text',
  'address.city': 'text',
  'address.country': 'text'
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel; 
