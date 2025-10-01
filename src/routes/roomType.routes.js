const express = require('express');
const router = express.Router();
const roomTypeController = require('../controllers/roomType.controller');

// Create a new room type
router.post('/', roomTypeController.createRoomType);

// Get all room types
router.get('/', roomTypeController.getRoomTypes);

// Get room type by ID
router.get('/:id', roomTypeController.getRoomTypeById);

// Update room type
router.put('/:id', roomTypeController.updateRoomType);

// Delete room type
router.delete('/:id', roomTypeController.deleteRoomType);

module.exports = router; 
