const jwt = require('jsonwebtoken');
const User = require('../models/userModels'); // Adjust the path as necessary

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization; // Assuming Bearer token
    const decoded =   jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    req.user = user; // Add the user to the request object for further use
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed: ' + error.message });
  }
};

module.exports = authMiddleware;