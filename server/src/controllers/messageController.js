const Message = require("../models/message.model");
const User = require("../models/user.model");
const Channel = require("../models/channel.model");

/**
 * @desc    Send a new message
 * @route   POST /api/message
 * @access  Protected
 */
const sendMessage = async (req, res) => {
  try {
    const { content, image, channelId } = req.body;

    if (!channelId) {
      console.log("Invalid data passed into request, channelId missing");
      return res.status(400).json({ message: "ChannelId is required" });
    }

    let newMessage;
    try {
      newMessage = await Message.create({
        sender: req.user._id,
        content: content,
        image: image,
        channel: channelId,
      });

      // Populate necessary fields for the frontend
      newMessage = await newMessage
        .populate("sender", "name avatar email username")
        .populate("channel");

      // Deep populate the users inside the channel object
    //   newMessage = await User.populate(newMessage, {
    //     path: "channel.users",
    //     select: "name avatar email username",
    //   });

      console.log("New message created ", newMessage);
    } catch (error) {
      console.error("Error while creating message:", error);
      return res.status(500).json({ message: "Failed to create message" });
    }

    try {
      // CRITICAL: Update the latestMessage in the Channel collection
      // This ensures the chat list is sorted by most recent activity
      await Channel.findByIdAndUpdate(req.body.channelId, {
        latestMessage: newMessage._id,
      });

      console.log("Updated latest message in channel ", req.body.channelId);
    } catch (error) {
      console.error("Error updating latest message in channel:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

/**
 * @desc    Fetch all messages for a specific channel
 * @route   GET /api/message/:channelId
 * @access  Protected
 */
const getMessages = async (req, res) => {
  try {
    const channelMessages = await Message.find({ channel: req.params.channelId })
      .populate("sender", "name avatar email username");
    console.log("Fetched messages for channel ", channelMessages.length);
    res.status(200).json(channelMessages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

module.exports = { sendMessage, getMessages };
