const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel.controller');

// Create a new hotel
router.post('/', hotelController.createHotel);

// Get all hotels (for admin)
router.get('/', hotelController.getHotels);

// Get active hotels (for client)
router.get('/active', hotelController.getActiveHotels);

// Search hotels
router.get('/search', hotelController.searchHotels);

// Get hotel by slug
router.get('/slug/:slug', hotelController.getHotelBySlug);

// Get hotel by ID
router.get('/:id', hotelController.getHotelById);

// Update hotel
router.put('/:id', hotelController.updateHotel);

// Soft delete hotel (ẩn khách sạn)
router.patch('/:id/soft-delete', hotelController.softDeleteHotel);

// Hard delete hotel (xóa thật + xóa ảnh)
router.delete('/:id', hotelController.hardDeleteHotel);

module.exports = router; 
