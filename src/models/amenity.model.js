const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const amenitySchema = new mongoose.Schema({
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
  icon: {
    type: String,
    default: 'default-amenity.png'
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
amenitySchema.index({ name: 1 });
amenitySchema.index({ is_active: 1 });

const Amenity = mongoose.model('Amenity', amenitySchema);

module.exports = Amenity; 
