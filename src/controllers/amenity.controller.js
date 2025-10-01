const amenityService = require('../services/amenity.service');
const logger = require('../config/logger');
const { 
  successResponse, 
  errorResponse, 
  notFoundResponse, 
  badRequestResponse 
} = require('../utils/responseHelper');

// Create a new amenity
exports.createAmenity = async (req, res) => {
  try {
    const amenity = await amenityService.createAmenity(req.body);
    successResponse(res, amenity, 'Tiện ích đã được tạo thành công', 201);
  } catch (error) {
    logger.error('Error creating amenity', { 
      error: error.message,
      stack: error.stack 
    });
    badRequestResponse(res, error.message);
  }
};

// Get all amenities
exports.getAmenities = async (req, res) => {
  try {
    const amenities = await amenityService.getAllAmenities();
    successResponse(res, amenities, 'Lấy danh sách tiện ích thành công');
  } catch (error) {
    logger.error('Error fetching amenities', { 
      error: error.message,
      stack: error.stack 
    });
    errorResponse(res, error.message);
  }
};

// Get amenity by ID
exports.getAmenityById = async (req, res) => {
  try {
    const amenity = await amenityService.getAmenityById(req.params.id);
    successResponse(res, amenity, 'Lấy thông tin tiện ích thành công');
  } catch (error) {
    logger.error('Error fetching amenity by ID', { 
      amenityId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    
    if (error.message === 'Amenity not found') {
      return notFoundResponse(res, 'Không tìm thấy tiện ích');
    }
    
    errorResponse(res, error.message);
  }
};

// Update amenity
exports.updateAmenity = async (req, res) => {
  try {
    const amenity = await amenityService.updateAmenity(req.params.id, req.body);
    successResponse(res, amenity, 'Cập nhật tiện ích thành công');
  } catch (error) {
    logger.error('Error updating amenity', { 
      amenityId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    
    if (error.message === 'Amenity not found') {
      return notFoundResponse(res, 'Không tìm thấy tiện ích');
    }
    
    badRequestResponse(res, error.message);
  }
};

// Delete amenity (soft delete)
exports.deleteAmenity = async (req, res) => {
  try {
    await amenityService.deleteAmenity(req.params.id);
    successResponse(res, null, 'Xóa tiện ích thành công');
  } catch (error) {
    logger.error('Error deleting amenity', { 
      amenityId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    
    if (error.message === 'Amenity not found') {
      return notFoundResponse(res, 'Không tìm thấy tiện ích');
    }
    
    errorResponse(res, error.message);
  }
}; 
