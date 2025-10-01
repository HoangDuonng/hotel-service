const Room = require('../models/room.model');
const logger = require('../config/logger');

// Create a new room
exports.createRoom = async (req, res) => {
  try {
    logger.info('Creating new room', { roomData: req.body });
    const room = new Room(req.body);
    await room.save();
    logger.info('Room created successfully', { roomId: room.document_id });
    res.status(201).json(room);
  } catch (error) {
    logger.error('Error creating room', { 
      error: error.message,
      stack: error.stack 
    });
    res.status(400).json({ message: error.message });
  }
};

// Get all rooms
exports.getRooms = async (req, res) => {
  try {
    logger.info('Fetching all rooms');
    const rooms = await Room.find({ is_active: true })
      .populate('hotel')
      .populate('room_type')
      .populate('amenities')
      .sort({ createdAt: -1 });
    logger.info(`Found ${rooms.length} rooms`);
    res.json(rooms);
  } catch (error) {
    logger.error('Error fetching rooms', { 
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({ message: error.message });
  }
};

// Get room by ID
exports.getRoomById = async (req, res) => {
  try {
    logger.info('Fetching room by ID', { roomId: req.params.id });
    const room = await Room.findOne({ 
      document_id: req.params.id,
      is_active: true 
    })
    .populate('hotel')
    .populate('room_type')
    .populate('amenities');
    
    if (!room) {
      logger.warn('Room not found', { roomId: req.params.id });
      return res.status(404).json({ message: 'Room not found' });
    }
    
    logger.info('Room found successfully', { roomId: room.document_id });
    res.json(room);
  } catch (error) {
    logger.error('Error fetching room by ID', { 
      roomId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({ message: error.message });
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  try {
    logger.info('Updating room', { 
      roomId: req.params.id,
      updateData: req.body 
    });
    
    const room = await Room.findOneAndUpdate(
      { document_id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    )
    .populate('hotel')
    .populate('room_type')
    .populate('amenities');
    
    if (!room) {
      logger.warn('Room not found for update', { roomId: req.params.id });
      return res.status(404).json({ message: 'Room not found' });
    }
    
    logger.info('Room updated successfully', { roomId: room.document_id });
    res.json(room);
  } catch (error) {
    logger.error('Error updating room', { 
      roomId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    res.status(400).json({ message: error.message });
  }
};

// Delete room (soft delete)
exports.deleteRoom = async (req, res) => {
  try {
    logger.info('Deleting room', { roomId: req.params.id });
    
    const room = await Room.findOneAndUpdate(
      { document_id: req.params.id },
      { is_active: false },
      { new: true }
    );
    
    if (!room) {
      logger.warn('Room not found for deletion', { roomId: req.params.id });
      return res.status(404).json({ message: 'Room not found' });
    }
    
    logger.info('Room deleted successfully', { roomId: room.document_id });
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    logger.error('Error deleting room', { 
      roomId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({ message: error.message });
  }
};

// Get rooms by hotel
exports.getRoomsByHotel = async (req, res) => {
  try {
    logger.info('Fetching rooms by hotel', { hotelId: req.params.hotelId });
    
    const rooms = await Room.find({ 
      hotel: req.params.hotelId,
      is_active: true 
    })
    .populate('room_type')
    .populate('amenities')
    .sort({ floor: 1, room_number: 1 });
    
    logger.info(`Found ${rooms.length} rooms for hotel`, { hotelId: req.params.hotelId });
    res.json(rooms);
  } catch (error) {
    logger.error('Error fetching rooms by hotel', { 
      hotelId: req.params.hotelId,
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({ message: error.message });
  }
};

// Search rooms
exports.searchRooms = async (req, res) => {
  try {
    const {
      hotelId,
      roomTypeId,
      minPrice,
      maxPrice,
      status,
      amenities
    } = req.query;

    logger.info('Searching rooms with criteria', { 
      hotelId,
      roomTypeId,
      minPrice,
      maxPrice,
      status,
      amenities
    });

    let searchQuery = { is_active: true };

    if (hotelId) searchQuery.hotel = hotelId;
    if (roomTypeId) searchQuery.room_type = roomTypeId;
    if (status) searchQuery.status = status;

    // Price range
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = Number(minPrice);
      if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
    }

    // Amenities
    if (amenities) {
      searchQuery.amenities = { $in: amenities.split(',') };
    }

    const rooms = await Room.find(searchQuery)
      .populate('hotel')
      .populate('room_type')
      .populate('amenities')
      .sort({ price: 1 });

    logger.info(`Found ${rooms.length} rooms matching search criteria`);
    res.json(rooms);
  } catch (error) {
    logger.error('Error searching rooms', { 
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({ message: error.message });
  }
}; 
