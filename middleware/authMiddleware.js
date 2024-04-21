const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token has expired
    const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
    if (decoded.exp < currentTime) {
      return res.status(401).json({ error: 'Token has expired' });
    } else {
      req.userId = decoded.userId;
    next();
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = verifyToken;