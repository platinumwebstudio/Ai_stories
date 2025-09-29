const mongoose = require('mongoose');

const VoicesElevenlabsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  voiceId: {
    type: String,
    required: true,
    unique: true,
  },
});

const VoicesElevenlabs = mongoose.model('Voices-Elevenlab', VoicesElevenlabsSchema);

module.exports = VoicesElevenlabs;
