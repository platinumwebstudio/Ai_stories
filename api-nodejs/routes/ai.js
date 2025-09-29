const express = require('express');
const auth = require('../middleware/auth');
const createAssistant = require("../services/createAssistant");
const chatAssistant = require("../services/chatAssistant");
const Assistant = require("../models/assistant");
const AssistantMessage = require("../models/assistantMessage");
const {Types} = require("mongoose");
const chatAssistantOnlyMessage = require("../services/chatAssistantOnlyMessage");
const VoicesElevenlabs = require("../models/voices-elevenlabs");

const router = express.Router();

router.post('/create', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, tone, voiceElevenlab, nameAI } = req.body;
    const data = await createAssistant({ name, tone, nameAI, res });

    if (!data) {
      res.status(500).send('Error creating assistant');
      return;
    }

    const newAssistant = new Assistant({
      assistantId: data.assistant.id,
      threadId: data.thread.id,
      tone: tone,
      user: userId,
      voiceElevenlab: voiceElevenlab,
      nameAI: nameAI ?? 'Bestie'
    });

    const assistant = await newAssistant
      .save()
      .then(assistant => assistant.populate('messages voiceElevenlab'));

    res.json(assistant);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/message', auth, async (req, res) => {
  try {
    const { message, assistantId } = req.body;
    chatAssistant({
      assistantId,
      text: message
    }).then((data) => {
      res.send(data)
    }).catch((err) => {
      console.log('err', err)
      res.send(null)
    })
  }
  catch (err) {
    console.log('err', err)
    res.send(null)
  }
});

router.post('/message-text', auth, async (req, res) => {
  try {
    const { message, assistantId } = req.body;
    chatAssistantOnlyMessage({
      assistantId,
      text: message
    }).then((data) => {
      res.send(data)
    }).catch((err) => {
      console.log('err', err)
      res.send(null)
    })
  }
  catch (err) {
    console.log('err', err)
    res.send(null)
  }
});

router.get('/list', auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const listAssistants = await Assistant.find({
      user: userId,
      $expr: { $gt: [{ $size: "$messages" }, 0] }
    })
      .populate('voiceElevenlab')
      .limit(100)
      .sort('-updatedAt');

    res.json(listAssistants);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/list-messages', auth, async (req, res) => {
  try {
    const { assistantId } = req.body;

    const listMessages = await AssistantMessage.find({
      assistant: new Types.ObjectId(assistantId),
    })
      .limit(100)
      .sort('-createdAt');

    res.json(listMessages);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/voices-elevenlabs', auth, async (req, res) => {
  try {
    const list = await VoicesElevenlabs
      .find({})
      .limit(20)
      .sort('-createdAt');

    res.json(list);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
