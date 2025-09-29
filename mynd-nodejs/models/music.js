const mongoose = require('mongoose');

const MusicSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const Music = mongoose.model('Music', MusicSchema);

module.exports = Music;
