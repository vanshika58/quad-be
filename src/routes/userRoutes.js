const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// User routes
router.post('/register', userController.register); // Create a new user
router.post('/login', userController.login); // Get all users
router.put('/updateUser', authMiddleware, userController.updateUser); // Update a user by ID
router.delete('/deleteUser', authMiddleware, userController.deleteUser); // Delete a user by ID

module.exports = router;