const RoomType = require('../models/roomType.model');
const logger = require('../config/logger');

// Create a new room type
exports.createRoomType = async (req, res) => {
  try {
    logger.info('Creating new room type', { roomTypeData: req.body });
    const roomType = new RoomType(req.body);
    await roomType.save();
    logger.info('Room type created successfully', { roomTypeId: roomType.document_id });
    res.status(201).json(roomType);
  } catch (error) {
    logger.error('Error creating room type', { 
      error: error.message,
      stack: error.stack 
    });
    res.status(400).json({ message: error.message });
  }
};

// Get all room types
exports.getRoomTypes = async (req, res) => {
  try {
    logger.info('Fetching all room types');
    const roomTypes = await RoomType.find({ is_active: true })
      .populate('amenities')
      .sort({ createdAt: -1 });
    logger.info(`Found ${roomTypes.length} room types`);
    res.json(roomTypes);
  } catch (error) {
    logger.error('Error fetching room types', { 
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({ message: error.message });
  }
};

// Get room type by ID
exports.getRoomTypeById = async (req, res) => {
  try {
    logger.info('Fetching room type by ID', { roomTypeId: req.params.id });
    const roomType = await RoomType.findOne({ 
      document_id: req.params.id,
      is_active: true 
    }).populate('amenities');
    
    if (!roomType) {
      logger.warn('Room type not found', { roomTypeId: req.params.id });
      return res.status(404).json({ message: 'Room type not found' });
    }
    
    logger.info('Room type found successfully', { roomTypeId: roomType.document_id });
    res.json(roomType);
  } catch (error) {
    logger.error('Error fetching room type by ID', { 
      roomTypeId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({ message: error.message });
  }
};

// Update room type
exports.updateRoomType = async (req, res) => {
  try {
    logger.info('Updating room type', { 
      roomTypeId: req.params.id,
      updateData: req.body 
    });
    
    const roomType = await RoomType.findOneAndUpdate(
      { document_id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!roomType) {
      logger.warn('Room type not found for update', { roomTypeId: req.params.id });
      return res.status(404).json({ message: 'Room type not found' });
    }
    
    logger.info('Room type updated successfully', { roomTypeId: roomType.document_id });
    res.json(roomType);
  } catch (error) {
    logger.error('Error updating room type', { 
      roomTypeId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    res.status(400).json({ message: error.message });
  }
};

// Delete room type (soft delete)
exports.deleteRoomType = async (req, res) => {
  try {
    logger.info('Deleting room type', { roomTypeId: req.params.id });
    
    const roomType = await RoomType.findOneAndUpdate(
      { document_id: req.params.id },
      { is_active: false },
      { new: true }
    );
    
    if (!roomType) {
      logger.warn('Room type not found for deletion', { roomTypeId: req.params.id });
      return res.status(404).json({ message: 'Room type not found' });
    }
    
    logger.info('Room type deleted successfully', { roomTypeId: roomType.document_id });
    res.json({ message: 'Room type deleted successfully' });
  } catch (error) {
    logger.error('Error deleting room type', { 
      roomTypeId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({ message: error.message });
  }
}; 
