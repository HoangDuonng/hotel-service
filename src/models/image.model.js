const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const imageSchema = new mongoose.Schema({
  document_id: {
    type: String,
    default: () => uuidv4(),
    unique: true,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  alt_text: {
    type: String,
    trim: true
  },
  is_primary: {
    type: Boolean,
    default: false
  },
  entity_type: {
    type: String,
    enum: ['hotel', 'room'],
    required: true
  },
  entity_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'entity_type'
  }
}, {
  timestamps: true
});

// Indexes
imageSchema.index({ entity_type: 1, entity_id: 1 });
imageSchema.index({ is_primary: 1 });

const Image = mongoose.model('Image', imageSchema);

module.exports = Image; 
