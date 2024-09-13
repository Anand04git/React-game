const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  highScore: { type: Number, default: 0 },
  pastScores: [{ score: Number, date: { type: Date, default: Date.now } }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;