const Hotel = require('../models/hotel.model');
const slugify = require('slugify');
const logger = require('../config/logger');
const imageService = require('./imageService');

class HotelService {
  // Hàm tạo slug từ tiếng Việt sử dụng slugify
  generateSlug(text) {
    return slugify(text, {
      lower: true,           // Chuyển thành chữ thường
      strict: true,          // Loại bỏ ký tự đặc biệt
      locale: 'vi',          // Hỗ trợ tiếng Việt
      remove: /[*+~.()'"!:@]/g // Loại bỏ thêm các ký tự đặc biệt
    });
  }

  // Hàm tạo slug unique
  async generateUniqueSlug(baseSlug) {
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const existingHotel = await Hotel.findOne({ slug });
      if (!existingHotel) {
        return slug;
      }
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  // Create a new hotel
  async createHotel(hotelData) {
    logger.info('Creating new hotel', { hotelData });
    
    // Tạo slug từ displayName
    const baseSlug = this.generateSlug(hotelData.displayName);
    hotelData.slug = await this.generateUniqueSlug(baseSlug);
    
    const hotel = new Hotel(hotelData);
    await hotel.save();
    logger.info('Hotel created successfully', { hotelId: hotel.document_id, slug: hotel.slug });
    return hotel;
  }

  // Get all hotels (for admin)
  async getAllHotels() {
    logger.info('Fetching all hotels (admin)');
    const hotels = await Hotel.find({})
      .sort({ createdAt: -1 });
    logger.info(`Found ${hotels.length} hotels`);
    return hotels;
  }

  // Get active hotels (for client)
  async getActiveHotels() {
    logger.info('Fetching active hotels (client)');
    const hotels = await Hotel.find({ is_active: true })
      .sort({ createdAt: -1 });
    logger.info(`Found ${hotels.length} active hotels`);
    return hotels;
  }

  // Get hotel by ID
  async getHotelById(hotelId) {
    logger.info('Fetching hotel by ID', { hotelId });
    const hotel = await Hotel.findOne({ 
      document_id: hotelId
    });
    
    if (!hotel) {
      logger.warn('Hotel not found', { hotelId });
      throw new Error('Hotel not found');
    }
    
    logger.info('Hotel found successfully', { hotelId: hotel.document_id });
    return hotel;
  }

  // Get hotel by slug
  async getHotelBySlug(slug) {
    logger.info('Fetching hotel by slug', { slug });
    const hotel = await Hotel.findOne({ 
      slug,
      is_active: true 
    });
    
    if (!hotel) {
      logger.warn('Hotel not found', { slug });
      throw new Error('Hotel not found');
    }
    
    logger.info('Hotel found successfully', { hotelId: hotel.document_id, slug: hotel.slug });
    return hotel;
  }

  // Update hotel
  async updateHotel(hotelId, updateData) {
    logger.info('Updating hotel', { 
      hotelId,
      updateData 
    });
    
    // Nếu có thay đổi displayName, tạo slug mới
    if (updateData.displayName) {
      const baseSlug = this.generateSlug(updateData.displayName);
      updateData.slug = await this.generateUniqueSlug(baseSlug);
    }
    
    const hotel = await Hotel.findOneAndUpdate(
      { document_id: hotelId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!hotel) {
      logger.warn('Hotel not found for update', { hotelId });
      throw new Error('Hotel not found');
    }
    
    logger.info('Hotel updated successfully', { hotelId: hotel.document_id });
    return hotel;
  }

  // Soft delete hotel (ẩn khách sạn)
  async softDeleteHotel(hotelId) {
    logger.info('Soft deleting hotel', { hotelId });
    
    const hotel = await Hotel.findOneAndUpdate(
      { document_id: hotelId },
      { is_active: false },
      { new: true }
    );
    
    if (!hotel) {
      logger.warn('Hotel not found for soft deletion', { hotelId });
      throw new Error('Hotel not found');
    }
    
    logger.info('Hotel soft deleted successfully', { hotelId: hotel.document_id });
    return hotel;
  }

  // Hard delete hotel (xóa thật + xóa ảnh)
  async hardDeleteHotel(hotelId) {
    logger.info('Hard deleting hotel', { hotelId });
    
    // Tìm hotel trước khi xóa để lấy thông tin ảnh
    const hotel = await Hotel.findOne({ document_id: hotelId });
    
    if (!hotel) {
      logger.warn('Hotel not found for hard deletion', { hotelId });
      throw new Error('Hotel not found');
    }
    
    // Xóa ảnh liên quan trước
    try {
      const imageResult = await imageService.deleteHotelImages(hotel);
      logger.info('Hotel images deletion result', { 
        hotelId: hotel.document_id,
        ...imageResult 
      });
    } catch (error) {
      logger.error('Error deleting hotel images', { 
        hotelId: hotel.document_id, 
        error: error.message 
      });
      // Vẫn tiếp tục xóa hotel ngay cả khi xóa ảnh thất bại
    }
    
    // Xóa hotel khỏi database
    const deletedHotel = await Hotel.findOneAndDelete({ document_id: hotelId });
    
    if (!deletedHotel) {
      logger.warn('Hotel not found for hard deletion', { hotelId });
      throw new Error('Hotel not found');
    }
    
    logger.info('Hotel hard deleted successfully', { hotelId: deletedHotel.document_id });
    return deletedHotel;
  }

  // Search hotels
  async searchHotels(searchParams) {
    const {
      query,
      region,
      minPrice,
      maxPrice,
      hotelFeatures,
      starRating,
      lat,
      lng,
      radius
    } = searchParams;

    let searchQuery = { is_active: true };

    // Text search
    if (query) {
      searchQuery.$text = { $search: query };
    }

    // Region filter
    if (region) {
      searchQuery.region = new RegExp(region, 'i');
    }

    // Price range
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = minPrice;
      if (maxPrice) searchQuery.price.$lte = maxPrice;
    }

    // Star rating
    if (starRating) {
      searchQuery.starRating = starRating;
    }

    // Hotel features
    if (hotelFeatures) {
      searchQuery.hotelFeatures = { $in: hotelFeatures.split(',') };
    }

    // Geospatial search using latitude/longitude
    if (lat && lng && radius) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const radiusKm = parseFloat(radius);
      
      // Tính toán khoảng cách đơn giản (có thể cải thiện sau)
      searchQuery.$and = [
        { latitude: { $gte: (latNum - radiusKm/111).toString() } },
        { latitude: { $lte: (latNum + radiusKm/111).toString() } },
        { longitude: { $gte: (lngNum - radiusKm/111).toString() } },
        { longitude: { $lte: (lngNum + radiusKm/111).toString() } }
      ];
    }

    const hotels = await Hotel.find(searchQuery)
      .sort({ createdAt: -1 });

    return hotels;
  }
}

module.exports = new HotelService(); 
