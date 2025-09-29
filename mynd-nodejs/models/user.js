const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['WAIT_OTP', 'WAIT_INFORMATION', 'DONE'],
    default: 'WAIT_OTP',
    required: true,
  },

  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  birth: {
    type: Date,
    required: false,
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE', 'OTHER'],
    required: false,
  },
  aboutMe: {
    type: String,
    required: false,
  },
  interests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interest',
    required: false,
  }],
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
