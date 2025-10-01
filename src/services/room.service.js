const Room = require('../models/room.model');
const logger = require('../config/logger');

class RoomService {
  // Create a new room
  async createRoom(roomData) {
    logger.info('Creating new room', { roomData });
    const room = new Room(roomData);
    await room.save();
    logger.info('Room created successfully', { roomId: room.document_id });
    return room;
  }

  // Get all rooms
  async getAllRooms() {
    logger.info('Fetching all rooms');
    const rooms = await Room.find({ is_active: true })
      .populate('room_type')
      .populate('amenities')
      .sort({ createdAt: -1 });
    logger.info(`Found ${rooms.length} rooms`);
    return rooms;
  }

  // Get room by ID
  async getRoomById(roomId) {
    logger.info('Fetching room by ID', { roomId });
    const room = await Room.findOne({ 
      document_id: roomId,
      is_active: true 
    })
    .populate('room_type')
    .populate('amenities');
    
    if (!room) {
      logger.warn('Room not found', { roomId });
      throw new Error('Room not found');
    }
    
    logger.info('Room found successfully', { roomId: room.document_id });
    return room;
  }

  // Update room
  async updateRoom(roomId, updateData) {
    logger.info('Updating room', { 
      roomId,
      updateData 
    });
    
    const room = await Room.findOneAndUpdate(
      { document_id: roomId },
      { $set: updateData },
      { new: true, runValidators: true }
    )
    .populate('room_type')
    .populate('amenities');
    
    if (!room) {
      logger.warn('Room not found for update', { roomId });
      throw new Error('Room not found');
    }
    
    logger.info('Room updated successfully', { roomId: room.document_id });
    return room;
  }

  // Delete room (soft delete)
  async deleteRoom(roomId) {
    logger.info('Deleting room', { roomId });
    
    const room = await Room.findOneAndUpdate(
      { document_id: roomId },
      { is_active: false },
      { new: true }
    );
    
    if (!room) {
      logger.warn('Room not found for deletion', { roomId });
      throw new Error('Room not found');
    }
    
    logger.info('Room deleted successfully', { roomId: room.document_id });
    return room;
  }

  // Get rooms by hotel
  async getRoomsByHotel(hotelId) {
    logger.info('Fetching rooms by hotel', { hotelId });
    
    const rooms = await Room.find({ 
      hotel: hotelId,
      is_active: true 
    })
    .populate('room_type')
    .populate('amenities')
    .sort({ floor: 1, room_number: 1 });
    
    logger.info(`Found ${rooms.length} rooms for hotel`, { hotelId });
    return rooms;
  }

  // Search rooms
  async searchRooms(searchParams) {
    const {
      hotelId,
      roomTypeId,
      minPrice,
      maxPrice,
      status,
      amenities
    } = searchParams;

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
      .populate('room_type')
      .populate('amenities')
      .sort({ price: 1 });

    logger.info(`Found ${rooms.length} rooms matching search criteria`);
    return rooms;
  }
}

module.exports = new RoomService(); 
