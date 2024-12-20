require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const cors = require('cors');

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());

app.use(express.json());

// Define Routes
app.use('/api', require('./src/routes/userRoutes'));

app.use('/task', require('./src/routes/taskRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));