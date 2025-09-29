const mongoose = require('mongoose');

const MeditationSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  minutes: {
    type: Number,
    required: true,
    min: 0,
  },
  goal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meditation-Goal',
    required: true,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meditation-Type',
    required: true,
  },
  music: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Music',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  intro: {
    message: {
      type: String,
      required: false,
    },
    voice: {
      type: String,
      required: false,
    },
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

const Meditation = mongoose.model('Meditation', MeditationSchema);

module.exports = Meditation;
