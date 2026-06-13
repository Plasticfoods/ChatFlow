const Message = require("../models/message.model");
const User = require("../models/user.model");
const Channel = require("../models/channel.model");

/**
 * @desc    Send a new message
 * @route   POST /api/message
 * @access  Protected
 */
const sendMessage = async (req, res) => {
  console.log("sendMessage called with body:", req.body);
  try {
    const { content, attachment, attachmentType, channelId } = req.body;

    if (!channelId) {
      console.log("Invalid data passed into request, channelId missing");
      return res.status(400).json({ message: "ChannelId is required" });
    }

    let newMessage;
    try {
      newMessage = await Message.create({
        sender: req.user._id,
        content: content,
        attachment: attachment,
        attachmentType: attachmentType,
        channel: channelId,
      });

      // Populate necessary fields for the frontend
      newMessage = await newMessage
        .populate("sender", "name avatar email username")
        // .populate("channel");

      // Deep populate the users inside the channel object
      //   newMessage = await User.populate(newMessage, {
      //     path: "channel.users",
      //     select: "name avatar email username",
      //   });

      console.log("New message created");
    } catch (error) {
      console.error("Error while creating message:", error);
      return res.status(500).json({ message: "Failed to create message" });
    }

    let updatedChannel;
    try {
      // CRITICAL: Update the latestMessage in the Channel collection
      // This ensures the chat list is sorted by most recent activity
      await Channel.findByIdAndUpdate(req.body.channelId, {
        latestMessage: newMessage._id,
      });

      // Fetch the updated channel with populated fields to return
      updatedChannel = await Channel.findById(req.body.channelId)
        .populate("users", "name avatar email username")
        .populate("latestMessage");

      // Remove the current user from the 'users' array in the response
      // updatedChannel = updatedChannel.toObject(); 
      // updatedChannel.users = updatedChannel.users.filter(
      //   (user) => user._id.toString() !== req.user._id.toString()
      // );  

      console.log("Updated latest message in channel");
    } catch (error) {
      console.error("Error updating latest message in channel:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
    
    console.log("Sending back new message to client");
    console.log(newMessage);
    console.log(updatedChannel);
    console.log("sendMessage completed successfully");
    res.status(201).json({ newMessage, channel: updatedChannel });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Failed to send message" });
  } finally {
    console.log("Finally block: sendMessage process completed");
  }
};

// Same message with only message object
const sendMessage2 = async (message) => {
  console.log("SendMessage2 called with message:", message);
  try {
    const { content, attachment, attachmentType, channelId, sender } = message;

    if (!channelId) {
      console.log("Invalid data passed into request, channelId missing");
      return null;
    }

    let newMessage;
    try {
      newMessage = await Message.create({
        sender: sender,
        content: content,
        attachment: attachment,
        attachmentType: attachmentType,
        channel: channelId,
      });

      // Populate necessary fields for the frontend
      newMessage = await newMessage
        .populate("sender", "name avatar email username")
        // .populate("channel");

      // Deep populate the users inside the channel object
      //   newMessage = await User.populate(newMessage, {
      //     path: "channel.users",
      //     select: "name avatar email username",
      //   });

      console.log("New message created");
    } catch (error) {
      console.error("Error while creating message:", error);
      return null; // Return null to indicate failure
    }

    let updatedChannel;
    try {
      // CRITICAL: Update the latestMessage in the Channel collection
      // This ensures the chat list is sorted by most recent activity
      await Channel.findByIdAndUpdate(channelId, {
        latestMessage: newMessage._id,
      });

      // Fetch the updated channel with populated fields to return
      updatedChannel = await Channel.findById(channelId)
        .populate("users", "name avatar email username")
        .populate("latestMessage");

      // Remove the current user from the 'users' array in the response
      // updatedChannel = updatedChannel.toObject(); 
      // updatedChannel.users = updatedChannel.users.filter(
      //   (user) => user._id.toString() !== req.user._id.toString()
      // );  

      console.log("Updated latest message in channel");
    } catch (error) {
      console.error("Error updating latest message in channel:", error);
      return null; // Return null to indicate failure
    }
    
    console.log("Sending back new message to client");
    console.log(newMessage);
    console.log(updatedChannel);
    console.log("sendMessage2 completed successfully");
    return { newMessage, updatedChannel };
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return null; // Return null to indicate failure
  } finally {
    console.log("Finally block: sendMessage process completed");
  }
};

/**
 * @desc    Fetch all messages for a specific channel
 * @route   GET /api/message/:channelId
 * @access  Protected
 */
const getMessages = async (req, res) => {
  console.log("getMessages called for channelId:", req.params.channelId);
  try {
    const channelMessages = await Message.find({
      channel: req.params.channelId,
    }).populate("sender", "name avatar email username");
    console.log("Fetched messages for channel ", channelMessages.length);
    res.status(200).json(channelMessages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

module.exports = { sendMessage, getMessages, sendMessage2 };
