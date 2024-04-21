const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
// Import route files
const authRoute = require('./routes/authRoute');
const apiRoutes = require('./routes/apiRoutes');
const apiSearchRoutes = require('./routes/apiSearchRoutes');
const userRoute = require('./routes/userRoute');
const cors = require('cors'); // Import CORS middleware

app.use(cors()); // Use CORS middleware to handle Cross-Origin Resource Sharing
app.use(express.json());
// Use middleware functions from route files
app.use('/auth', authRoute);
app.use('/api', apiRoutes);
app.use('/api', apiSearchRoutes);
app.use('/auth', userRoute);

// Wrap the database connection code in an async function
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to the database');
  } catch (error) {
    console.error('Database connection error:', error);
    // Handle the error appropriately (e.g., exit the process)
    process.exit(1);
  }
};

// Call the async function
connectToDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle root URL
app.get('/', (req, res) => {
  res.send('Hello, this is your server!');
});