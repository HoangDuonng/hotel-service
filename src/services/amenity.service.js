const Amenity = require('../models/amenity.model');
const logger = require('../config/logger');

class AmenityService {
  // Create a new amenity
  async createAmenity(amenityData) {
    logger.info('Creating new amenity', { amenityData });
    const amenity = new Amenity(amenityData);
    await amenity.save();
    logger.info('Amenity created successfully', { amenityId: amenity.document_id });
    return amenity;
  }

  // Get all amenities
  async getAllAmenities() {
    logger.info('Fetching all amenities');
    const amenities = await Amenity.find({ is_active: true })
      .sort({ name: 1 });
    logger.info(`Found ${amenities.length} amenities`);
    return amenities;
  }

  // Get amenity by ID
  async getAmenityById(amenityId) {
    logger.info('Fetching amenity by ID', { amenityId });
    const amenity = await Amenity.findOne({ 
      document_id: amenityId,
      is_active: true 
    });
    
    if (!amenity) {
      logger.warn('Amenity not found', { amenityId });
      throw new Error('Amenity not found');
    }
    
    logger.info('Amenity found successfully', { amenityId: amenity.document_id });
    return amenity;
  }

  // Update amenity
  async updateAmenity(amenityId, updateData) {
    logger.info('Updating amenity', { 
      amenityId,
      updateData 
    });
    
    const amenity = await Amenity.findOneAndUpdate(
      { document_id: amenityId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!amenity) {
      logger.warn('Amenity not found for update', { amenityId });
      throw new Error('Amenity not found');
    }
    
    logger.info('Amenity updated successfully', { amenityId: amenity.document_id });
    return amenity;
  }

  // Delete amenity (soft delete)
  async deleteAmenity(amenityId) {
    logger.info('Deleting amenity', { amenityId });
    
    const amenity = await Amenity.findOneAndUpdate(
      { document_id: amenityId },
      { is_active: false },
      { new: true }
    );
    
    if (!amenity) {
      logger.warn('Amenity not found for deletion', { amenityId });
      throw new Error('Amenity not found');
    }
    
    logger.info('Amenity deleted successfully', { amenityId: amenity.document_id });
    return amenity;
  }
}

module.exports = new AmenityService(); 
