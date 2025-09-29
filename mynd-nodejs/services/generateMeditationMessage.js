const dotenv = require('dotenv');
const OpenAI = require('openai');
const createAudioFileFromText = require('./elevenLabs/createAudioFileFromText');

dotenv.config();

const openai = new OpenAI(process.env.RESUME_PARSER_PORT);

const generateMeditationMessage = async ({ type, feel, goal, description }) => {
  let phrase = null

  try {
    switch (type) {
      case 'INTRO':
        phrase = `This is an Intro section. Provide an intro message for a meditation session focusing on ${feel}. My goal ${goal}. The user feels: ${description}. At the end of the intro, invite the user to close their eyes, and feel the seat pressing into their body, then gently forward them to focus on their breath, and count each inhalation and exhalation, very gently and slowly instruct them to count an inhalation on 1 and exhalation on 2, then inhalation on 3, exhalation on 4, inhalation on 5, exhalation on 6, inhalation on 7, exhalation on 8, inhalation in 9, exhalation on 10 ( count 1s 2s 3s 4s 5s 6s 7s 8s 9s 10s very slowly with spaces in between them, add spaces in between each count to represent a pause for user to inhale and exhale).  Then say "Great", now that they know how to meditate, gently instruct them to follow and count their breaths in this way for the rest of the meditation. Quotations (") are never used to denominate inches, never say inches.Here is an example of a shorter version of an intro section, however you must not make yours as short as this one, yours is supposed to be longer, example: Begin by finding a comfortable seat in a quiet space where you won't be disturbed. Allow yourself to sit back or lie down. Close your eyes, and take a deep breath in through your nose, then exhale slowly through your mouth. Repeat this breathing pattern a few more times, each breath slower and deeper than the last.`
        break;
      case 'MID':
        phrase = `This is one of the middle sections. It may be the first one, another one or last one, you need to consider your previous responses and understand if this is the first middle section message or a continuation of the meditation script. You must give a 30-60 words answershort answer. Provide a mid-session message for a meditation focusing on ${feel}. My goal ${goal}. Gently remind the user to count their breaths. Gently remind them that it is alright if their minds wandered and say something philosophical about ${goal} and how the mind wanders. Keep it short. Here are good examples of middle section messages: “As you continue to breathe deeply, visualize yourself in your workspace at Google. See the environment around you – the colors, the light, the objects. Now, imagine a soft, warm light beginning to glow from your workspace, enveloping you in a calm, soothing energy. With each breath, this light grows warmer, helping to dissolve any tension or stress from your body.”. “Think about the current project you are managing. Visualize it as an object in your hands. Notice its weight and texture. Acknowledge the challenge it presents, but also recognize your capability and experience. With your next exhale, imagine setting this object down gently beside you, giving yourself permission to step away just for this moment.” “Shift your focus to your life outside of work. Imagine another object that represents an aspect of your personal life that brings you joy – perhaps a hobby, time with loved. Feel the texture and weight of this object, noticing how different it is from the first. This object is lighter, easier to carry. Hold this object close to your heart, and allow yourself to feel the joy and relaxation it brings.”. “Now, see yourself standing between these two objects. Breathe in the balance you create by being present in both aspects of your life. With each breath, feel more empowered to manage both, knowing that you have the strength and ability to prioritize and nurture each part of your life.”. This is only an example of how a middle message can be structured, you will be generating multiple middle messages and all of them need to flow chronologically and make sense right until the outro section, also do not limit yourself to strictly follow this example, show creativity and randomly choose (no calculation) whether to follow these examples more or less closely. You are not concluding anything in the middle section. You are not finishing the meditation in the middle section.`
        break;
      case 'END':
        phrase = `This is an outro section. Firstly, provide an end-session message for a meditation focusing on ${feel}. My goal ${goal}. As you continue this end-session message, invite the user to focus on sounds around them, sensations, feel the air on their skin, feel the connection to their seat, then gently instruct the user to open their eyes. Summarize the session and provide some advice.`
        break;
      default:
        throw new Error("Invalid message type");
    }
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      // max_tokens: 100,
      messages: [
        { role: 'system', content: 'You are a helpful meditation guide. You shouldn\'t answer like in these examples "Certainly, Here\'s a thoughtful message". Your task will be to generate text for a TTS model to voice over. The meditation is split into three sections, Intro, Central and Outro. The text will be a meditation script. In the central messages, NOT intro and NOT outro, you must make a very personalized script based around problems or goals of the user. You must employ various techniques like making the user visualize, employ different mindfulness techniques to make each meditation unique and helpful to the user. You will follow a particular script and will consider your previous responses while generating each new central message. You will also add personalization in the intro and the outro.' },
        { role: 'user', content: phrase }
      ],
    });

    return {
      message: `${response.choices[0].message.content.trim()}`,
      voice: await createAudioFileFromText(response.choices[0].message.content.trim())
    };
  }
  catch (error) {
    throw new Error(`Error generateIntroMessage: ${error}`);
  }
}

module.exports = generateMeditationMessage;
