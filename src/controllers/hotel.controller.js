const Hotel = require('../models/hotel.model');
const logger = require('../config/logger');

// Create a new hotel
exports.createHotel = async (req, res) => {
  try {
    logger.info('Creating new hotel', { hotelData: req.body });
    const hotel = new Hotel(req.body);
    await hotel.save();
    logger.info('Hotel created successfully', { hotelId: hotel.document_id });
    res.status(201).json(hotel);
  } catch (error) {
    logger.error('Error creating hotel', { 
      error: error.message,
      stack: error.stack 
    });
    res.status(400).json({ message: error.message });
  }
};

// Get all hotels
exports.getHotels = async (req, res) => {
  try {
    logger.info('Fetching all hotels');
    const hotels = await Hotel.find({ is_active: true })
      .populate('amenities')
      .sort({ createdAt: -1 });
    logger.info(`Found ${hotels.length} hotels`);
    res.json(hotels);
  } catch (error) {
    logger.error('Error fetching hotels', { 
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({ message: error.message });
  }
};

// Get hotel by ID
exports.getHotelById = async (req, res) => {
  try {
    logger.info('Fetching hotel by ID', { hotelId: req.params.id });
    const hotel = await Hotel.findOne({ 
      document_id: req.params.id,
      is_active: true 
    }).populate('amenities');
    
    if (!hotel) {
      logger.warn('Hotel not found', { hotelId: req.params.id });
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    logger.info('Hotel found successfully', { hotelId: hotel.document_id });
    res.json(hotel);
  } catch (error) {
    logger.error('Error fetching hotel by ID', { 
      hotelId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({ message: error.message });
  }
};

// Update hotel
exports.updateHotel = async (req, res) => {
  try {
    logger.info('Updating hotel', { 
      hotelId: req.params.id,
      updateData: req.body 
    });
    
    const hotel = await Hotel.findOneAndUpdate(
      { document_id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('amenities');
    
    if (!hotel) {
      logger.warn('Hotel not found for update', { hotelId: req.params.id });
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    logger.info('Hotel updated successfully', { hotelId: hotel.document_id });
    res.json(hotel);
  } catch (error) {
    logger.error('Error updating hotel', { 
      hotelId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    res.status(400).json({ message: error.message });
  }
};

// Delete hotel (soft delete)
exports.deleteHotel = async (req, res) => {
  try {
    logger.info('Deleting hotel', { hotelId: req.params.id });
    
    const hotel = await Hotel.findOneAndUpdate(
      { document_id: req.params.id },
      { is_active: false },
      { new: true }
    );
    
    if (!hotel) {
      logger.warn('Hotel not found for deletion', { hotelId: req.params.id });
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    logger.info('Hotel deleted successfully', { hotelId: hotel.document_id });
    res.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    logger.error('Error deleting hotel', { 
      hotelId: req.params.id,
      error: error.message,
      stack: error.stack 
    });
    res.status(500).json({ message: error.message });
  }
};

// Search hotels
exports.searchHotels = async (req, res) => {
  try {
    const {
      query,
      city,
      country,
      minPrice,
      maxPrice,
      amenities,
      starRating,
      lat,
      lng,
      radius
    } = req.query;

    let searchQuery = { is_active: true };

    // Text search
    if (query) {
      searchQuery.$text = { $search: query };
    }

    // Location filters
    if (city) searchQuery['address.city'] = new RegExp(city, 'i');
    if (country) searchQuery['address.country'] = new RegExp(country, 'i');

    // Price range
    if (minPrice || maxPrice) {
      searchQuery['rooms.price'] = {};
      if (minPrice) searchQuery['rooms.price'].$gte = Number(minPrice);
      if (maxPrice) searchQuery['rooms.price'].$lte = Number(maxPrice);
    }

    // Star rating
    if (starRating) {
      searchQuery.star_rating = Number(starRating);
    }

    // Amenities
    if (amenities) {
      searchQuery.amenities = { $in: amenities.split(',') };
    }

    // Geospatial search
    if (lat && lng && radius) {
      searchQuery.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)]
          },
          $maxDistance: Number(radius) * 1000 // Convert km to meters
        }
      };
    }

    const hotels = await Hotel.find(searchQuery)
      .populate('amenities')
      .sort({ createdAt: -1 });

    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 
