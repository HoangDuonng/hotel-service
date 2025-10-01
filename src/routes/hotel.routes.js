const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel.controller');

// Create a new hotel
router.post('/', hotelController.createHotel);

// Get all hotels
router.get('/', hotelController.getHotels);

// Search hotels
router.get('/search', hotelController.searchHotels);

// Get hotel by ID
router.get('/:id', hotelController.getHotelById);

// Update hotel
router.put('/:id', hotelController.updateHotel);

// Delete hotel
router.delete('/:id', hotelController.deleteHotel);

module.exports = router; 
