const User = require("../models/user.model");

/**
 * @desc    Get all users (Search functionality)
 * @route   GET /api/user?search=john
 * @access  Protected
 */
const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    // Return users matching search, excluding the current logged-in user
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in allUsers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @desc    Get User Profile
 * @route   GET /api/user/profile
 * @access  Protected
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      console.log("User not found with ID:", req.user._id);
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      about: user.about,
      role: user.role,
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @desc    Update User Profile
 * @route   PUT /api/user/profile
 * @access  Protected
 */
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      console.log("User not found with ID:", req.user._id);
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.about = req.body.about || user.about;
    user.avatar = req.body.avatar || user.avatar;

    // Only update password if user provided a new one
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      about: updatedUser.about,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { searchUsers, getUserProfile, updateUserProfile };