const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  priority: {
    type: String,
    required: true,
  },
  taskDetails: {
    type: String,
    required: true,
  },
  important: {
    type : Boolean,
    default: false,
  },
  completed: {
    type : Boolean,
    default: false ,
  },
  planned: {
    type : Boolean, 
    default: false,
  }

});

module.exports = mongoose.model('Task', TaskSchema);