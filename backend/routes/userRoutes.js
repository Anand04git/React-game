// routes/userRoutes.js

const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    res.json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch user data by username
router.get('/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ highScore: user.highScore, pastScores: user.pastScores });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user scores
router.post('/:username/update-scores', async (req, res) => {
  const { username } = req.params;
  const { score } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update high score if the new score is higher
    if (score > user.highScore) {
      user.highScore = score;
    }

    // Add the new score to past scores
    user.pastScores.push({ score: score, date: new Date() });

    // Save the updated user data
    await user.save();
    res.json({ message: 'Scores updated successfully', highScore: user.highScore, pastScores: user.pastScores });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
