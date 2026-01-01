const Channel = require("../models/channel.model");

/**
 * @desc    Create or fetch One-on-One Chat
 * @route   POST /api/channel
 * @access  Protected
 */
const accessChannel = async (req, res) => {
  try {
    const { participantId } = req.body;
    let isChannel;

    try {
      // 1. Check if a non-group chat already exists with these two users
      isChannel = await Channel.find({
        isGroupChannel: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: participantId } } },
        ],
      })
        .populate("users", "-password")
        .populate("latestMessage");

      // Populate the sender info inside the latestMessage
      isChannel = await User.populate(isChannel, {
        path: "latestMessage.sender",
        select: "name avatar email username",
      });
    } catch (error) {
      console.error("Error while accessing channel: ", error);
      return res.status(500).json({ message: "Failed to access channel" });
    }
    console.log("isChannel:", isChannel);

    if (isChannel.length > 0) {
      // Chat exists, return it
      console.log(
        "Channel already exists with users ",
        req.user.username,
        " and ",
        participantId
      );
      res.status(200).json(isChannel[0]);
      return;
    }

    // Chat doesn't exist, create new one
    console.log(
      "Creating new channel with users ",
      req.user.username,
      " and ",
      participantId
    );
    let channelData = {
      channelName: "single", // For 1-on-1, name doesn't really matter
      isGroupChannel: false,
      users: [req.user._id, participantId],
    };

    try {
      const createdChannel = await Channel.create(channelData);
      const newChannel = await Channel.findOne({
        _id: createdChannel._id,
      }).populate("users", "-password");
      console.log("New channel created: ", newChannel);
      res.status(200).send(newChannel);
    } catch (error) {
      console.error("Error while creating channel:", error);
      res.status(500).send({ message: "Failed to create channel" });
    }
  } catch (error) {
    console.error("Error accessing / creating channel:", error);
    res.status(500).send({ message: "Server error" });
  }
};

/**
 * @desc    Fetch all chats for a user
 * @route   GET /api/channel
 * @access  Protected
 */
const fetchChannels = async (req, res) => {
  try {
    let results = await Channel.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 }); // Newest first chats

    // Populate the sender info inside the latestMessage
    results = await User.populate(results, {
      path: "latestMessage.sender",
      select: "name avatar email",
    });

    console.log("Fetched channels for user ", req.user.username);
    console.log(results);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching channels:", error);
    res.status(500).json({ message: "Failed to fetch channels" });
  }
};

/**
 * @desc    Create New Group Chat
 * @route   POST /api/channel/group
 * @access  Protected
 */
const createGroupChannel = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  // Assuming 'users' is sent as a JSON array of IDs from the frontend
  var users = req.body.users;

  // Note: If you send stringified JSON from frontend, use JSON.parse(req.body.users)
  // For now, assuming Axios sends a real array.

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  // Add current user to the group list
  users.push(req.user);

  try {
    const groupChannel = await Channel.create({
      channelName: req.body.name,
      users: users,
      isGroupChannel: true,
      groupAdmin: req.user,
    });

    const fullGroupChannel = await Channel.findOne({ _id: groupChannel._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChannel);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

/**
 * @desc    Delete chat
 * @route   DELETE /api/channel/:channelId
 * @access  Protected
 */
const deleteChannel = async (req, res) => {
    try {
        const { channelId } = req.params;
        const deletedChannel = await Channel.findByIdAndDelete(channelId);
        console.log("Deleted channel:", deletedChannel);

        // Delete associated messages here as well
        const deletedMessages = await Message.deleteMany({ channel: channelId });
        console.log("Deleted messages associated with channel:", deletedMessages.length);

        res.status(200).json({ message: "Channel deleted successfully" });
    } catch (error) {
        console.error("Error deleting channel:", error);
        res.status(500).json({ message: "Failed to delete channel" });
    }
};


/**
 * @desc    Rename Group
 * @route   PUT /api/channel/rename
 * @access  Protected
 */
const renameGroup = async (req, res) => {
  const { channelId, channelName } = req.body;

  const updatedChannel = await Channel.findByIdAndUpdate(
    channelId,
    { channelName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChannel) {
    res.status(404);
    throw new Error("Channel Not Found");
  } else {
    res.json(updatedChannel);
  }
};

/**
 * @desc    Add user to Group
 * @route   PUT /api/channel/groupadd
 * @access  Protected
 */
const addToGroup = async (req, res) => {
  const { channelId, userId } = req.body;

  const added = await Channel.findByIdAndUpdate(
    channelId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Channel Not Found");
  } else {
    res.json(added);
  }
};

/**
 * @desc    Remove user from Group
 * @route   PUT /api/channel/groupremove
 * @access  Protected
 */
const removeFromGroup = async (req, res) => {
  const { channelId, userId } = req.body;

  const removed = await Channel.findByIdAndUpdate(
    channelId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Channel Not Found");
  } else {
    res.json(removed);
  }
};

module.exports = {
  accessChannel,
  fetchChannels,
  deleteChannel,
  createGroupChannel,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
