/**
 * Response Helper - Chuẩn hóa format response cho API
 */

// Success response
const successResponse = (res, data = null, message = 'Thành công', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

// Error response
const errorResponse = (res, message = 'Có lỗi xảy ra', statusCode = 500, data = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data
  });
};

// Not found response
const notFoundResponse = (res, message = 'Không tìm thấy', data = null) => {
  return errorResponse(res, message, 404, data);
};

// Bad request response
const badRequestResponse = (res, message = 'Dữ liệu không hợp lệ', data = null) => {
  return errorResponse(res, message, 400, data);
};

// Unauthorized response
const unauthorizedResponse = (res, message = 'Không có quyền truy cập', data = null) => {
  return errorResponse(res, message, 401, data);
};

// Forbidden response
const forbiddenResponse = (res, message = 'Truy cập bị từ chối', data = null) => {
  return errorResponse(res, message, 403, data);
};

// Conflict response
const conflictResponse = (res, message = 'Dữ liệu đã tồn tại', data = null) => {
  return errorResponse(res, message, 409, data);
};

module.exports = {
  successResponse,
  errorResponse,
  notFoundResponse,
  badRequestResponse,
  unauthorizedResponse,
  forbiddenResponse,
  conflictResponse
}; 
