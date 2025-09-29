const Assistant = require("../models/assistant");
const AssistantMessage = require("../models/assistantMessage");

const updateAllAssistantsDescription = async () => {
  const assistants = await Assistant.find();
  assistants.forEach(async (assistant) => {
    const assistantMessages = await AssistantMessage.find({
      assistant: assistant._id,
    });
    /* description */
    if (assistantMessages[1]?.message) {
      assistant.description = assistantMessages[1].message;
      await assistant.save();
    }
  });
};

module.exports = updateAllAssistantsDescription;
