const User = require('../models/userModels');
const bcrypt = require('bcryptjs'); // You'll need bcryptjs to hash passwords
const jwt = require('jsonwebtoken'); // And jsonwebtoken to create JWTs for the users

// Registration logic
exports.register = async (req, res) => {
  try {
    // Hash the password before saving the user
    const hashedPassword =  await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      pic: req.body.pic,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET, // Ensure you have JWT_SECRET in your environment variables
        { expiresIn: '24h' }
      );
      const userWithoutPassword = await User.findById(user._id).select('-password');

      res.status(201).json({ message: 'User created successfully', user: userWithoutPassword, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login logic
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      // Create a token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET, // Make sure to have a JWT_SECRET in your environment variables
        { expiresIn: '24h' }
      );
      res.json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Login failed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user profile logic
exports.updateUser = async (req, res) => {
    try {
  
      const updates = req.body;
      const options = { new: true };
  
      // Ensure password is hashed if it's being updated
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }
  
      // Use the userId from the decoded token instead of req.params.id
      const user = await User.findByIdAndUpdate(req.user.id, updates, options).select("-password");
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User updated successfully', user });
    } catch (error) {
      res.status(400).json({ error: 'Authentication failed or ' + error.message });
    }
  };
  
  // ... existing code ...
  
  // Delete user logic
  exports.deleteUser = async (req, res) => {
    try {
      // Extract the token from the Authorization header
      const token = req.headers.authorization; // Assuming Bearer token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Use the userId from the decoded token instead of req.params.id
      const user = await User.findByIdAndDelete(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Authentication failed or ' + error.message });
    }
  };
  
  // ... existing code ...