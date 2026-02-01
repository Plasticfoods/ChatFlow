const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true, default: null },
    attachment: { type: String, default: null },
    attachmentType: { type: String, default: null }, // 'image' or 'pdf'
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", index: true },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // For "Blue Ticks"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);