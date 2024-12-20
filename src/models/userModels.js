const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  taskArray: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], // Ensure 'Task' matches the model name
    default: [],
  },
  name: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
  }
});

module.exports = mongoose.model('User', UserSchema);