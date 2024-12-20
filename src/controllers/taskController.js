const Task = require('../models/taskModel'); // Adjust the path as necessary
const User = require('../models/userModels'); // Adjust the path as necessary


// Create a new task
// ... existing code ...

// Create a new task and add its ID to the user's taskArray
exports.createTask = async (req, res) => {
    try {
      const task = new Task(req.body);
      await task.save();
  
      // Assuming the user's ID is in req.user.id after authentication
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      // Push the new task's ID to the user's taskArray
      user.taskArray.push(task.id);
      await user.save();
  
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  // ... existing code ...

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    // Assuming the user's ID is in req.user.id after authentication
    const user = await User.findById(req.user.id).populate({
      path: 'taskArray',
      model: 'Task' // Ensure this matches the name used in mongoose.model for the Task schema
    }).exec()
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(user)
    res.status(200).json(user.taskArray);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a task by ID
// Update a task by ID
exports.updateTask = async (req, res) => {
  try {
    debugger
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
     // Update only the fields that were actually passed...
    Object.keys(req.body).forEach(key => {
      task[key] = req.body[key];  
    });
     await task.save(); // Save the updated task
     res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
} ;

// Delete a task by ID
exports.deleteTask = async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      // Find the user who owns the task and remove the task's ID from their taskArray
      const user = await User.findById(req.user.id);
      if (user) {
        user.taskArray.pull(task._id); // pull is a Mongoose method to remove an item from an array
        await user.save();
      }
  
      // Now delete the task
      await Task.findByIdAndDelete(task._id);
  
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };