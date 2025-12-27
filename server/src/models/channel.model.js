const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  {
    channelName: { type: String, trim: true }, // For group channels; null for DM
    isGroupChannel: { type: Boolean, default: false },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true } // Manages createdAt and updatedAt automatically
);

module.exports = mongoose.model("Channel", channelSchema);