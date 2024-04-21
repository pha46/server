const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RevokedToken = require('../models/RevokedToken');

// User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Compare the provided password with the stored password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token for the authenticated user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return success message and token
    res.status(200).json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User registration
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username exists
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Define the number of salt rounds for hashing
    const saltRounds = 10;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed username and password
    const newUser = new User({ username, password: hashedPassword});

    // Save the user in the database
    await newUser.save();

    // Generate a JWT token for the new user
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '5m' });

    // Return success message and token
    res.status(201).json({ message: 'User account created successfully ! Please login.', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/logout', async (req, res) => {
 try { 
  const { token } = req.body;

  // First, check for all tokens with expiry greater than 1 hour
  const expiredTokens = await RevokedToken.find({ createdAt: { $lt: new Date(Date.now() - 60 * 60 * 1000)}});

  // Delete all tokens with extended expiry time
  await RevokedToken.deleteMany({ createdAt: { $lt: new Date(Date.now() - 60 * 60 * 1000)}});

  // Save the new revoked token
  const newRevokedToken = new RevokedToken({ token });
  await newRevokedToken.save();

  res.status(200).json({ message: 'Token revoked successfully', expiredTokensCount: expiredTokens.length });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error'});
}});

module.exports = router;