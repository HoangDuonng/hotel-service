const roomService = require('../services/room.service');
const logger = require('../config/logger');
const { 
  successResponse, 
  errorResponse, 
  notFoundResponse, 
  badRequestResponse 
} = require('../utils/responseHelper');

// Create a new room
exports.createRoom = async (req, res) => {
  try {
    const room = await roomService.createRoom(req.body);
    successResponse(res, room, 'Phòng đã được tạo thành công', 201);
  } catch (error) {
    logger.error('Error creating room', { 
      error: error.message,
      stack: error.stack 
    });
    badRequestResponse(res, error.message);
  }
};

// Get all rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await roomService.getAllRooms();
    successResponse(res, rooms, 'Lấy danh sách phòng thành công');
  } catch (error) {
    logger.error('Error fetching rooms', { 
      error: error.message,
      stack: error.stack 
    });
    errorResponse(res, error.message);
  }
};

// Get room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    successResponse(res, room, 'Lấy thông tin phòng thành công');
  } catch (error) {
    logger.error('Error fetching room by ID', { 
      roomId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    
    if (error.message === 'Room not found') {
      return notFoundResponse(res, 'Không tìm thấy phòng');
    }
    
    errorResponse(res, error.message);
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  try {
    const room = await roomService.updateRoom(req.params.id, req.body);
    successResponse(res, room, 'Cập nhật phòng thành công');
  } catch (error) {
    logger.error('Error updating room', { 
      roomId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    
    if (error.message === 'Room not found') {
      return notFoundResponse(res, 'Không tìm thấy phòng');
    }
    
    badRequestResponse(res, error.message);
  }
};

// Delete room (soft delete)
exports.deleteRoom = async (req, res) => {
  try {
    await roomService.deleteRoom(req.params.id);
    successResponse(res, null, 'Xóa phòng thành công');
  } catch (error) {
    logger.error('Error deleting room', { 
      roomId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    
    if (error.message === 'Room not found') {
      return notFoundResponse(res, 'Không tìm thấy phòng');
    }
    
    errorResponse(res, error.message);
  }
};

// Get rooms by hotel
exports.getRoomsByHotel = async (req, res) => {
  try {
    const rooms = await roomService.getRoomsByHotel(req.params.hotelId);
    successResponse(res, rooms, 'Lấy danh sách phòng theo khách sạn thành công');
  } catch (error) {
    logger.error('Error fetching rooms by hotel', { 
      hotelId: req.params.hotelId,
      error: error.message,
      stack: error.stack 
    });
    errorResponse(res, error.message);
  }
};

// Search rooms
exports.searchRooms = async (req, res) => {
  try {
    const rooms = await roomService.searchRooms(req.query);
    successResponse(res, rooms, 'Tìm kiếm phòng thành công');
  } catch (error) {
    logger.error('Error searching rooms', { 
      error: error.message,
      stack: error.stack 
    });
    errorResponse(res, error.message);
  }
}; 
