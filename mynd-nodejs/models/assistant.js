const mongoose = require("mongoose");

const AssistantSchema = new mongoose.Schema(
  {
    assistantId: {
      type: String,
      required: true,
    },
    threadId: {
      type: String,
      required: true,
    },
    nameAI: {
      type: String,
      required: true,
    },
    tone: {
      type: String,
      enum: ["PROFESSIONAL", "CASUAL", "QUIRKY"],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    voiceElevenlab: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voices-Elevenlab",
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assistant-Message",
        required: false,
      },
    ],
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

const Assistant = mongoose.model("Assistant", AssistantSchema);

module.exports = Assistant;
