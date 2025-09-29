const mongoose = require('mongoose');

const MeditationTypeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const MeditationType = mongoose.model('Meditation-Type', MeditationTypeSchema);

module.exports = MeditationType;
