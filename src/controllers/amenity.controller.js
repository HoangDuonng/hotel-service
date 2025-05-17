const Amenity = require('../models/amenity.model');
const logger = require('../config/logger');

// Create a new amenity
exports.createAmenity = async (req, res) => {
  try {
    logger.info('Creating new amenity', { amenityData: req.body });
    const amenity = new Amenity(req.body);
    await amenity.save();
    logger.info('Amenity created successfully', { amenityId: amenity.document_id });
    res.status(201).json(amenity);
  } catch (error) {
    logger.error('Error creating amenity', { 
      error: error.message,
      stack: error.stack 
    });
    res.status(400).json({ message: error.message });
  }
};

// Get all amenities
exports.getAmenities = async (req, res) => {
  try {
    logger.info('Fetching all amenities');
    const amenities = await Amenity.find({ is_active: true })
      .sort({ name: 1 });
    logger.info(`Found ${amenities.length} amenities`);
    res.json(amenities);
  } catch (error) {
    logger.error('Error fetching amenities', { 
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({ message: error.message });
  }
};

// Get amenity by ID
exports.getAmenityById = async (req, res) => {
  try {
    logger.info('Fetching amenity by ID', { amenityId: req.params.id });
    const amenity = await Amenity.findOne({ 
      document_id: req.params.id,
      is_active: true 
    });
    
    if (!amenity) {
      logger.warn('Amenity not found', { amenityId: req.params.id });
      return res.status(404).json({ message: 'Amenity not found' });
    }
    
    logger.info('Amenity found successfully', { amenityId: amenity.document_id });
    res.json(amenity);
  } catch (error) {
    logger.error('Error fetching amenity by ID', { 
      amenityId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({ message: error.message });
  }
};

// Update amenity
exports.updateAmenity = async (req, res) => {
  try {
    logger.info('Updating amenity', { 
      amenityId: req.params.id,
      updateData: req.body 
    });
    
    const amenity = await Amenity.findOneAndUpdate(
      { document_id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!amenity) {
      logger.warn('Amenity not found for update', { amenityId: req.params.id });
      return res.status(404).json({ message: 'Amenity not found' });
    }
    
    logger.info('Amenity updated successfully', { amenityId: amenity.document_id });
    res.json(amenity);
  } catch (error) {
    logger.error('Error updating amenity', { 
      amenityId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    res.status(400).json({ message: error.message });
  }
};

// Delete amenity (soft delete)
exports.deleteAmenity = async (req, res) => {
  try {
    logger.info('Deleting amenity', { amenityId: req.params.id });
    
    const amenity = await Amenity.findOneAndUpdate(
      { document_id: req.params.id },
      { is_active: false },
      { new: true }
    );
    
    if (!amenity) {
      logger.warn('Amenity not found for deletion', { amenityId: req.params.id });
      return res.status(404).json({ message: 'Amenity not found' });
    }
    
    logger.info('Amenity deleted successfully', { amenityId: amenity.document_id });
    res.json({ message: 'Amenity deleted successfully' });
  } catch (error) {
    logger.error('Error deleting amenity', { 
      amenityId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({ message: error.message });
  }
}; 
