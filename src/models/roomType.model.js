const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const roomTypeSchema = new mongoose.Schema({
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
    trim: true
  },
  base_price: {
    type: Number,
    required: true,
    min: 0
  },
  max_capacity: {
    type: Number,
    required: true,
    min: 1
  },
  amenities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Amenity'
  }],
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
roomTypeSchema.index({ name: 1 });
roomTypeSchema.index({ base_price: 1 });
roomTypeSchema.index({ is_active: 1 });

const RoomType = mongoose.model('RoomType', roomTypeSchema);

module.exports = RoomType; 
