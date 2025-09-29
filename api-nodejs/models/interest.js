const mongoose = require('mongoose');

const InterestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  }
});

const Interest = mongoose.model('Interest', InterestSchema);

module.exports = Interest;
