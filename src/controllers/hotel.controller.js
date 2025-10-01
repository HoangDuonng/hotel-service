const hotelService = require('../services/hotel.service');
const logger = require('../config/logger');
const { 
  successResponse, 
  errorResponse, 
  notFoundResponse, 
  badRequestResponse 
} = require('../utils/responseHelper');

// Create a new hotel
exports.createHotel = async (req, res) => {
  try {
    const hotel = await hotelService.createHotel(req.body);
    successResponse(res, hotel, 'Khách sạn đã được tạo thành công', 201);
  } catch (error) {
    logger.error('Error creating hotel', { 
      error: error.message,
      stack: error.stack 
    });
    badRequestResponse(res, error.message);
  }
};

// Get all hotels (for admin)
exports.getHotels = async (req, res) => {
  try {
    const hotels = await hotelService.getAllHotels();
    successResponse(res, hotels, 'Lấy danh sách khách sạn thành công');
  } catch (error) {
    logger.error('Error fetching hotels', { 
      error: error.message,
      stack: error.stack 
    });
    errorResponse(res, error.message);
  }
};

// Get active hotels (for client)
exports.getActiveHotels = async (req, res) => {
  try {
    const hotels = await hotelService.getActiveHotels();
    successResponse(res, hotels, 'Lấy danh sách khách sạn thành công');
  } catch (error) {
    logger.error('Error fetching active hotels', { 
      error: error.message,
      stack: error.stack 
    });
    errorResponse(res, error.message);
  }
};

// Get hotel by ID
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await hotelService.getHotelById(req.params.id);
    successResponse(res, hotel, 'Lấy thông tin khách sạn thành công');
  } catch (error) {
    logger.error('Error fetching hotel by ID', { 
      hotelId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    
    if (error.message === 'Hotel not found') {
      return notFoundResponse(res, 'Không tìm thấy khách sạn');
    }
    
    errorResponse(res, error.message);
  }
};

// Get hotel by slug
exports.getHotelBySlug = async (req, res) => {
  try {
    const hotel = await hotelService.getHotelBySlug(req.params.slug);
    successResponse(res, hotel, 'Lấy thông tin khách sạn thành công');
  } catch (error) {
    logger.error('Error fetching hotel by slug', { 
      slug: req.params.slug,
      error: error.message,
      stack: error.stack 
    });
    
    if (error.message === 'Hotel not found') {
      return notFoundResponse(res, 'Không tìm thấy khách sạn');
    }
    
    errorResponse(res, error.message);
  }
};

// Update hotel
exports.updateHotel = async (req, res) => {
  try {
    const hotel = await hotelService.updateHotel(req.params.id, req.body);
    successResponse(res, hotel, 'Cập nhật khách sạn thành công');
  } catch (error) {
    logger.error('Error updating hotel', { 
      hotelId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    
    if (error.message === 'Hotel not found') {
      return notFoundResponse(res, 'Không tìm thấy khách sạn');
    }
    
    badRequestResponse(res, error.message);
  }
};

// Soft delete hotel (ẩn khách sạn)
exports.softDeleteHotel = async (req, res) => {
  try {
    await hotelService.softDeleteHotel(req.params.id);
    successResponse(res, null, 'Ẩn khách sạn thành công');
  } catch (error) {
    logger.error('Error soft deleting hotel', { 
      hotelId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    
    if (error.message === 'Hotel not found') {
      return notFoundResponse(res, 'Không tìm thấy khách sạn');
    }
    
    errorResponse(res, error.message);
  }
};

// Hard delete hotel (xóa thật + xóa ảnh)
exports.hardDeleteHotel = async (req, res) => {
  try {
    await hotelService.hardDeleteHotel(req.params.id);
    successResponse(res, null, 'Xóa khách sạn thành công');
  } catch (error) {
    logger.error('Error hard deleting hotel', { 
      hotelId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    
    if (error.message === 'Hotel not found') {
      return notFoundResponse(res, 'Không tìm thấy khách sạn');
    }
    
    errorResponse(res, error.message);
  }
};

// Search hotels
exports.searchHotels = async (req, res) => {
  try {
    const hotels = await hotelService.searchHotels(req.query);
    successResponse(res, hotels, 'Tìm kiếm khách sạn thành công');
  } catch (error) {
    logger.error('Error searching hotels', { 
      error: error.message,
      stack: error.stack 
    });
    errorResponse(res, error.message);
  }
}; 
