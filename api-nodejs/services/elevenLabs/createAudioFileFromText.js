const dotenv = require('dotenv');
const {createWriteStream} = require("fs");
const {v4: uuidv4} = require("uuid");
const {ElevenLabsClient} = require("elevenlabs");
const path = require("path");

dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const client = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

const createAudioFileFromText = async (text) => {
  return new Promise(async (resolve, reject) => {
    try {
      const audio = await client.generate({
        voice: "Nicole",
        model_id: "eleven_turbo_v2",
        text,
      });
      const filename = `/uploads/speech-${uuidv4()}.mp3`;
      const speechFile = path.resolve(`.${filename}`);
      const fileStream = createWriteStream(speechFile);

      audio.pipe(fileStream);
      fileStream.on("finish", () => {
        console.log('createAudioFileFromText success', filename)
        resolve(filename);
      });
      fileStream.on("error", (error) => {
        console.log('createAudioFileFromText Error', error)
        reject(error);
      });
    } catch (error) {
      console.log('createAudioFileFromText Error', error)
      reject(error);
    }
  });
};

module.exports = createAudioFileFromText;
