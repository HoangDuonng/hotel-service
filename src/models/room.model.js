const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const roomSchema = new mongoose.Schema({
  document_id: {
    type: String,
    default: () => uuidv4(),
    unique: true,
    required: true
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  room_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoomType',
    required: true
  },
  room_number: {
    type: String,
    required: true,
    trim: true
  },
  floor: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'reserved'],
    default: 'available'
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
roomSchema.index({ hotel: 1 });
roomSchema.index({ room_type: 1 });
roomSchema.index({ room_number: 1 });
roomSchema.index({ status: 1 });
roomSchema.index({ price: 1 });
roomSchema.index({ is_active: 1 });

// Compound index for unique room number per hotel
roomSchema.index({ hotel: 1, room_number: 1 }, { unique: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room; 
