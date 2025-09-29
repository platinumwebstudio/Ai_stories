const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');
const Interest = require("../models/interest");
const {Types} = require("mongoose");

const router = express.Router();

router.get('/details', auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select('-password').populate('interests');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/edit', auth, async (req, res) => {
  const userId = req.user.id;
  const { firstName, lastName, birth, gender, aboutMe } = req.body;

  try {
    const user = await User.findById(userId);

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (birth) user.birth = birth;
    if (gender) user.gender = gender;
    if (aboutMe || aboutMe === '') user.aboutMe = aboutMe;
    if (user.status === 'WAIT_INFORMATION') user.status = 'DONE';

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/interests/list', auth, async (req, res) => {
  try {
    const list = await Interest.find({});

    res.json(list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/interests/edit', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { interestIds } = req.body;

    const interestObjectIds = interestIds.map(id => new Types.ObjectId(id));

    const result = await User.updateOne(
      { _id: userId },
      { $addToSet: { interests: { $each: interestObjectIds } } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ msg: 'User not found or interests already up-to-date' });
    }

    res.json({ msg: 'User updated successfully', result });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).send('Server error');
  }
});

router.post('/interests/remove', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { interestId } = req.body;

    // Convert string ID to ObjectId using the `new` keyword
    const interestObjectId = new Types.ObjectId(interestId);

    // Remove interest from user interests
    const result = await User.updateOne(
      { _id: userId },
      { $pull: { interests: interestObjectId } }
    ).populate('interests');

    if (result.nModified === 0) {
      return res.status(404).json({ msg: 'User not found or interest not found in user interests' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
