const express = require('express');
const router = express.Router();
const amenityController = require('../controllers/amenity.controller');

// Create a new amenity
router.post('/', amenityController.createAmenity);

// Get all amenities
router.get('/', amenityController.getAmenities);

// Get amenity by ID
router.get('/:id', amenityController.getAmenityById);

// Update amenity
router.put('/:id', amenityController.updateAmenity);

// Delete amenity
router.delete('/:id', amenityController.deleteAmenity);

module.exports = router; 
