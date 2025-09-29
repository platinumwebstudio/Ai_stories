const dotenv = require('dotenv');
const OpenAI = require('openai');
const MeditationType = require("../models/meditationType");
const MeditationGoal = require("../models/meditationGoal");
const Music = require("../models/music");
const generateMeditationMessage = require("./generateMeditationMessage");
const Meditation = require("../models/meditation");

dotenv.config();

const openai = new OpenAI(process.env.RESUME_PARSER_PORT);

const randomMeditation = async () => {
  const times = [5, 10, 15, 20, 25, 30];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a meditation topic generating bot. Your task is to write random the text this format: Meditation that will help me with (hardship or aim of the user)... Only suggest positive topics' },
        { role: 'user', content: `Write me a random topic for meditation. For example: "I’m social media influencer I’m struggling on followers are not increasing ","I want to go to Taylor swift concert but tickets are expensive ","Meditation that will help me with focus and motivation for work...","Meditation that will help me cope with feeling unloved and misunderstood by my girlfriend due to my work commitments and struggles.","Meditation that will help me with feeling annoyed at my clients who underpay me...","Meditation that will help me enhance my feelings of well-being...","Meditation that will help me with stress and focus","Meditation that will help me with my fear of Chinese people...","Meditation that will help me overcome my fear of people with different eye shapes and appearances...","Meditation that will help me with feeling bad about my work...","I just lost the job and feeling stressed ","Meditation that will help me with feeling refreshed and balanced","Meditation that will help me cultivate self-worth and find inner peace...","Meditation that will help me cultivate hope and optimism","Meditation that will help me with feeling energized, rested, and motivated."` }
      ],
    });

    const randomMeditationType = await MeditationType.aggregate([
      { $sample: { size: 1 } } // random
    ]);

    const randomMeditationGoal = await MeditationGoal.aggregate([
      { $sample: { size: 1 } } // random
    ]);

    const randomMeditationMusic = await Music.aggregate([
      { $sample: { size: 1 } } // random
    ]);

    const introMessage = await generateMeditationMessage({
      type: 'INTRO',
      feel: randomMeditationType?._id,
      goal: randomMeditationGoal?._id,
      description: `${response.choices[0].message.content.trim()}`,
    });

    const newMeditation = new Meditation({
      description: `${response.choices[0].message.content.trim()}`,
      minutes: times[Math.floor(Math.random() * times.length)],
      goal: randomMeditationGoal[0]?._id,
      type: randomMeditationType[0]?._id,
      music: randomMeditationMusic[0]?._id,
      intro: introMessage
    });

    return await newMeditation
      .save()
      .then(meditation => meditation.populate('goal type music'));
  }
  catch (error) {
    throw new Error(`Error suggestText: ${error}`);
  }
}

module.exports = randomMeditation;
