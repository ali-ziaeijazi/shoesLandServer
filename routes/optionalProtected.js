const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function optionalAuthenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    req.user = null; 
    return next(); 
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET); 
    req.user = payload; 
  } catch (err) {
    req.user = null; 
  }

  next(); 
}

module.exports = optionalAuthenticateToken;
