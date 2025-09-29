const dotenv = require("dotenv");
const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const createAudioFileFromText = require("./elevenLabs/createAudioFileFromText");
const Assistant = require("../models/assistant");
const AssistantMessage = require("../models/assistantMessage");

dotenv.config();

const openai = new OpenAI(process.env.RESUME_PARSER_PORT);

const generateVoice = async (text) => {
  const filename = `/uploads/speech-${uuidv4()}.mp3`;

  try {
    const speechFile = path.resolve(`.${filename}`);

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);

    return filename;
  } catch (error) {
    console.error("Error generateVoice", error);
    return null;
  }
};

const chatAssistant = async ({ assistantId, text }) => {
  try {
    const assistant = await Assistant.findOne({ _id: assistantId });

    if (!assistant) {
      console.error("Assistant not found");
      return;
    }

    const newMessage = await new AssistantMessage({
      assistant: assistant?._id,
      type: "user",
      message: `${text}`,
    }).save();

    assistant.messages.push(newMessage?._id);
    await assistant.save();

    await openai.beta.threads.messages.create(assistant?.threadId, {
      role: "user",
      content: text,
    });

    let run = await openai.beta.threads.runs.create(assistant?.threadId, {
      assistant_id: assistant?.assistantId,
      temperature: 1.3,
      stream: true,
    });

    const chatLog = [];

    for await (const part of run) {
      if (
        Array.isArray(part?.data?.content) &&
        part?.data?.content[0]?.text?.value
      ) {
        const voice = await generateVoice(part?.data?.content[0]?.text?.value); //await createAudioFileFromText(part?.data?.content[0]?.text?.value)

        const newMessage = await new AssistantMessage({
          assistant: assistant?._id,
          type: "system",
          message: `${part?.data?.content[0]?.text?.value}`,
          voice: voice,
        }).save();

        if (!assistant?.description)
          assistant.description = `${part?.data?.content[0]?.text?.value}`;

        assistant.messages.push(newMessage?._id);
        await assistant.save();

        chatLog.push({
          message: `${part?.data?.content[0]?.text?.value}`,
          voice: voice,
        });

        return chatLog;
      }
    }
  } catch (error) {
    console.error("Error summarizing text:", error);
    return null;
  }
};

module.exports = chatAssistant;
