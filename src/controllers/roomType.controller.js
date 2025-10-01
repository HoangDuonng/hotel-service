const roomTypeService = require('../services/roomType.service');
const logger = require('../config/logger');
const { 
  successResponse, 
  errorResponse, 
  notFoundResponse, 
  badRequestResponse 
} = require('../utils/responseHelper');

// Create a new room type
exports.createRoomType = async (req, res) => {
  try {
    const roomType = await roomTypeService.createRoomType(req.body);
    successResponse(res, roomType, 'Loại phòng đã được tạo thành công', 201);
  } catch (error) {
    logger.error('Error creating room type', { 
      error: error.message,
      stack: error.stack 
    });
    badRequestResponse(res, error.message);
  }
};

// Get all room types
exports.getRoomTypes = async (req, res) => {
  try {
    const roomTypes = await roomTypeService.getAllRoomTypes();
    successResponse(res, roomTypes, 'Lấy danh sách loại phòng thành công');
  } catch (error) {
    logger.error('Error fetching room types', { 
      error: error.message,
      stack: error.stack 
    });
    errorResponse(res, error.message);
  }
};

// Get room type by ID
exports.getRoomTypeById = async (req, res) => {
  try {
    const roomType = await roomTypeService.getRoomTypeById(req.params.id);
    successResponse(res, roomType, 'Lấy thông tin loại phòng thành công');
  } catch (error) {
    logger.error('Error fetching room type by ID', { 
      roomTypeId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    
    if (error.message === 'Room type not found') {
      return notFoundResponse(res, 'Không tìm thấy loại phòng');
    }
    
    errorResponse(res, error.message);
  }
};

// Update room type
exports.updateRoomType = async (req, res) => {
  try {
    const roomType = await roomTypeService.updateRoomType(req.params.id, req.body);
    successResponse(res, roomType, 'Cập nhật loại phòng thành công');
  } catch (error) {
    logger.error('Error updating room type', { 
      roomTypeId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    
    if (error.message === 'Room type not found') {
      return notFoundResponse(res, 'Không tìm thấy loại phòng');
    }
    
    badRequestResponse(res, error.message);
  }
};

// Delete room type (soft delete)
exports.deleteRoomType = async (req, res) => {
  try {
    await roomTypeService.deleteRoomType(req.params.id);
    successResponse(res, null, 'Xóa loại phòng thành công');
  } catch (error) {
    logger.error('Error deleting room type', { 
      roomTypeId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    
    if (error.message === 'Room type not found') {
      return notFoundResponse(res, 'Không tìm thấy loại phòng');
    }
    
    errorResponse(res, error.message);
  }
}; 
