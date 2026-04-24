const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 401, 'Akses ditolak. Token tidak disediakan.', 'UNAUTHORIZED');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'skillswap_secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Token tidak valid atau telah kadaluarsa', 'INVALID_TOKEN');
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return errorResponse(res, 403, 'Akses terbatas untuk admin', 'FORBIDDEN');
  }
};

module.exports = {
  verifyToken,
  isAdmin
};
