const RoomType = require('../models/roomType.model');
const logger = require('../config/logger');

class RoomTypeService {
  // Create a new room type
  async createRoomType(roomTypeData) {
    logger.info('Creating new room type', { roomTypeData });
    const roomType = new RoomType(roomTypeData);
    await roomType.save();
    logger.info('Room type created successfully', { roomTypeId: roomType.document_id });
    return roomType;
  }

  // Get all room types
  async getAllRoomTypes() {
    logger.info('Fetching all room types');
    const roomTypes = await RoomType.find({ is_active: true })
      .populate('amenities')
      .sort({ createdAt: -1 });
    logger.info(`Found ${roomTypes.length} room types`);
    return roomTypes;
  }

  // Get room type by ID
  async getRoomTypeById(roomTypeId) {
    logger.info('Fetching room type by ID', { roomTypeId });
    const roomType = await RoomType.findOne({ 
      document_id: roomTypeId,
      is_active: true 
    }).populate('amenities');
    
    if (!roomType) {
      logger.warn('Room type not found', { roomTypeId });
      throw new Error('Room type not found');
    }
    
    logger.info('Room type found successfully', { roomTypeId: roomType.document_id });
    return roomType;
  }

  // Update room type
  async updateRoomType(roomTypeId, updateData) {
    logger.info('Updating room type', { 
      roomTypeId,
      updateData 
    });
    
    const roomType = await RoomType.findOneAndUpdate(
      { document_id: roomTypeId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!roomType) {
      logger.warn('Room type not found for update', { roomTypeId });
      throw new Error('Room type not found');
    }
    
    logger.info('Room type updated successfully', { roomTypeId: roomType.document_id });
    return roomType;
  }

  // Delete room type (soft delete)
  async deleteRoomType(roomTypeId) {
    logger.info('Deleting room type', { roomTypeId });
    
    const roomType = await RoomType.findOneAndUpdate(
      { document_id: roomTypeId },
      { is_active: false },
      { new: true }
    );
    
    if (!roomType) {
      logger.warn('Room type not found for deletion', { roomTypeId });
      throw new Error('Room type not found');
    }
    
    logger.info('Room type deleted successfully', { roomTypeId: roomType.document_id });
    return roomType;
  }
}

module.exports = new RoomTypeService(); 
