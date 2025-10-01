const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');

// Create a new room
router.post('/', roomController.createRoom);

// Get all rooms
router.get('/', roomController.getRooms);

// Search rooms
router.get('/search', roomController.searchRooms);

// Get rooms by hotel
router.get('/hotel/:hotelId', roomController.getRoomsByHotel);

// Get room by ID
router.get('/:id', roomController.getRoomById);

// Update room
router.put('/:id', roomController.updateRoom);

// Delete room
router.delete('/:id', roomController.deleteRoom);

module.exports = router; 
