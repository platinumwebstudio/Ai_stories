const mongoose = require('mongoose');

const AssistantMessageSchema = new mongoose.Schema({
  assistant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assistant',
    required: true,
  },
  type: {
    type: String,
    enum: ['user', 'system'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  voice: {
    type: String,
    required: false,
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

const AssistantMessage = mongoose.model('Assistant-Message', AssistantMessageSchema);

module.exports = AssistantMessage;
