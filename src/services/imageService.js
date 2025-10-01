const logger = require('../config/logger');

class ImageService {
  constructor() {
    // URL của image service (có thể config từ env)
    this.imageServiceUrl = process.env.IMAGE_SERVICE_URL;
    logger.info('ImageService initialized', { imageServiceUrl: this.imageServiceUrl });
  }

  // Xóa ảnh theo URL (sử dụng fetch thay vì axios)
  async deleteImageByUrl(imageUrl) {
    try {
      logger.info('Deleting image by URL', { imageUrl });
      
      // Thử endpoint với params thay vì body
      const response = await fetch(`${this.imageServiceUrl}/api/images/url?imageUrl=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      logger.info('Image deleted successfully', { imageUrl });
      return result;
    } catch (error) {
      logger.error('Error deleting image by URL', { 
        imageUrl, 
        error: error.message 
      });
      // Không throw error để không ảnh hưởng đến việc xóa hotel
      return null;
    }
  }

  // Xóa nhiều ảnh theo danh sách URLs (dùng bulk endpoint)
  async deleteMultipleImages(imageUrls) {
    try {
      logger.info('Deleting multiple images (bulk)', { count: imageUrls.length });
      const response = await fetch(`${this.imageServiceUrl}/api/files/bulk/images/hotels`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrls }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      logger.info('Bulk image deletion result', result);
      // Giả sử result trả về { successCount, failedCount }
      return result;
    } catch (error) {
      logger.error('Error deleting multiple images (bulk)', { error: error.message });
      return { successCount: 0, failedCount: imageUrls.length };
    }
  }

  // Xóa tất cả ảnh của một hotel
  async deleteHotelImages(hotel) {
    try {
      const imageUrls = [];
      
      // Thêm ảnh chính
      if (hotel.imageUrl && hotel.imageUrl !== 'default.webp') {
        imageUrls.push(hotel.imageUrl);
      }
      
      // Thêm ảnh chi tiết
      if (hotel.imageUrls && Array.isArray(hotel.imageUrls)) {
        imageUrls.push(...hotel.imageUrls.filter(url => url && url !== 'default.webp'));
      }
      
      if (imageUrls.length === 0) {
        logger.info('No images to delete for hotel', { hotelId: hotel.document_id });
        return { successCount: 0, failedCount: 0 };
      }
      
      logger.info('Deleting hotel images', { 
        hotelId: hotel.document_id, 
        imageCount: imageUrls.length 
      });
      
      return await this.deleteMultipleImages(imageUrls);
    } catch (error) {
      logger.error('Error deleting hotel images', { 
        hotelId: hotel.document_id, 
        error: error.message 
      });
      return { successCount: 0, failedCount: 0 };
    }
  }

  // Xóa ảnh theo danh sách URLs (tiện ích)
  async deleteImagesByUrls(imageUrls) {
    try {
      if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
        logger.info('No image URLs provided for deletion');
        return { successCount: 0, failedCount: 0 };
      }
      
      // Lọc bỏ URLs rỗng hoặc default
      const validUrls = imageUrls.filter(url => url && url !== 'default.webp');
      
      if (validUrls.length === 0) {
        logger.info('No valid image URLs to delete');
        return { successCount: 0, failedCount: 0 };
      }
      
      logger.info('Deleting images by URLs', { count: validUrls.length });
      return await this.deleteMultipleImages(validUrls);
    } catch (error) {
      logger.error('Error deleting images by URLs', { error: error.message });
      return { successCount: 0, failedCount: imageUrls.length };
    }
  }
}

module.exports = new ImageService(); 
