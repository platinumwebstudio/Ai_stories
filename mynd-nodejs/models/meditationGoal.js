const mongoose = require('mongoose');

const MeditationGoalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  }
});

const MeditationGoal = mongoose.model('Meditation-Goal', MeditationGoalSchema);

module.exports = MeditationGoal;
