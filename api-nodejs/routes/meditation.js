const express = require("express");
const auth = require("../middleware/auth");
const generateMeditationMessage = require("../services/generateMeditationMessage");
const suggestText = require("../services/suggestText");
const Music = require("../models/music");
const MeditationType = require("../models/meditationType");
const MeditationGoal = require("../models/meditationGoal");
const Meditation = require("../models/meditation");
const Assistant = require("../models/assistant");

const router = express.Router();

router.post("/create", auth, async (req, res) => {
  const { description, typeId, goalId, musicId, minutes } = req.body;
  const userId = req.user.id;

  try {
    const type = await MeditationType.findById(typeId);
    const goal = await MeditationGoal.findById(goalId);
    const music = await Music.findById(musicId);

    if (!music || !type || !goal) {
      return res.status(400).send("Related documents not found");
    }

    const introMessage = await generateMeditationMessage({
      type: "INTRO",
      feel: type._id,
      goal: goal._id,
      description,
    });

    const newMeditation = new Meditation({
      description,
      minutes,
      user: userId,
      goal: goal._id,
      type: type._id,
      music: music._id,
      intro: introMessage,
    });

    const meditation = await newMeditation
      .save()
      .then((meditation) => meditation.populate("goal type music"));

    res.json(meditation);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

router.post("/generate", auth, async (req, res) => {
  const { type, feel, goal, description } = req.body;

  try {
    const message = await generateMeditationMessage({
      type: type, // INTRO | MID | END
      feel,
      goal,
      description,
    });
    res.json(message);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/suggest", auth, async (req, res) => {
  const { description } = req.body;

  try {
    res.json({
      message: await suggestText({
        description,
      }),
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/list-music", async (req, res) => {
  try {
    const listMusic = await Music.find().limit(20);

    res.json(listMusic);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/list-types", async (req, res) => {
  try {
    const listTypes = await MeditationType.find().limit(20);

    res.json(listTypes);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/list-goals", async (req, res) => {
  try {
    const listGoals = await MeditationGoal.find().limit(20);

    res.json(listGoals);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/list", auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const listMeditations = await Meditation.find({ user: userId })
      .limit(100)
      .sort("-updatedAt")
      .populate("goal type music");

    res.json(listMeditations);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/list-recommendation", auth, async (req, res) => {
  try {
    const listMeditations = await Meditation.find({ user: null })
      .limit(3)
      .sort("-updatedAt")
      .populate("goal type music");

    res.json(listMeditations);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/open-recommendation", auth, async (req, res) => {
  const userId = req.user.id;

  try {
    const { meditationId } = req.body;

    const originalMeditation = await Meditation.findById(meditationId);

    if (!originalMeditation) {
      return res.status(404).json({ message: "Meditation not found" });
    }

    const clonedMeditation = new Meditation({
      ...originalMeditation.toObject(),
      _id: undefined,
      user: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saveClonedMeditation = await clonedMeditation
      .save()
      .then((meditation) => meditation.populate("goal type music"));

    res.json(saveClonedMeditation);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/search", auth, async (req, res) => {
  const userId = req.user.id;
  const { idGoal, idType } = req.body;

  try {
    const listMeditations = await Meditation.find({
      //user: userId,
      /* goal: idGoal,
      or
      type: idType, */

      $or: [{ goal: idGoal }, { type: idType }],
    })
      .limit(100)
      .sort("-updatedAt")
      .populate("goal type music");

    res.json(listMeditations);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/assistants/search", auth, async (req, res) => {
  const userId = req.user.id;
  const { searchValue } = req.body;

  try {
    const listAssistants = await Assistant.find({
      user: userId,
      description: { $regex: searchValue, $options: "i" },
    })
      .limit(100)
      .sort("-updatedAt");

    res.json(listAssistants);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
