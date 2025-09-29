const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const openai = new OpenAI(process.env.RESUME_PARSER_PORT);

const suggestText = async ({ description }) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a meditation topic generating bot. Your task is to rewrite the text that you receive from a user into this format: Meditation that will help me with (hardship or aim of the user)... Only suggest positive topics' },
        { role: 'user', content: description }
      ],
    });

    return `${response.choices[0].message.content.trim()}`;
  }
  catch (error) {
    throw new Error(`Error suggestText: ${error}`);
  }
}

module.exports = suggestText;
