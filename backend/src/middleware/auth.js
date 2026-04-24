const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Token tidak ada atau invalid', 'AUTH_REQUIRED');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    // Set user payload to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token sudah kedaluwarsa', 'INVALID_TOKEN');
    }
    return errorResponse(res, 401, 'Token tidak valid', 'INVALID_TOKEN');
  }
};

module.exports = authMiddleware;
