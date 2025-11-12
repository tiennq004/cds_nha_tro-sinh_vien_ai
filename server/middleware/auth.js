const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware xác thực JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token không được cung cấp' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token không hợp lệ' });
    }
    req.user = user;
    next();
  });
};

// Middleware kiểm tra quyền landlord
const requireLandlord = (req, res, next) => {
  if (req.user.role !== 'landlord') {
    return res.status(403).json({ error: 'Chỉ người cho thuê mới có quyền thực hiện' });
  }
  next();
};

// Middleware kiểm tra quyền renter
const requireRenter = (req, res, next) => {
  if (req.user.role !== 'renter') {
    return res.status(403).json({ error: 'Chỉ người thuê mới có quyền thực hiện' });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireLandlord,
  requireRenter
};

