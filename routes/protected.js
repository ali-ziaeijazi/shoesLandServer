const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET); 
    req.user = payload; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired access token.' });
  }
}

module.exports = authenticateToken;
