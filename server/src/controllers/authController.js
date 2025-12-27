const User = require("../models/user.model");
const { setAuthCookie, clearAuthCookie } = require("../utils/tokenUtils");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const register = async (req, res) => {
  const { name, email, username, password } = req.body;

  try {
    if (!name || !email || !username || !password) {
      res.status(400).json({ message: "Please provide all required fields" });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists with username: ", username);
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = await User.create({
      name,
      email,
      username,
      password,
    });

    if (user) {
      setAuthCookie(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      });
      console.log("User registered successfully: ", username);
    } else {
      console.log("Failed to create user");
      res.status(400).json({ message: "Failed to create the user" });
    }
  } catch (error) {
    console.error("Error during user registration: ", error);
    res.status(500).json({ message: "Failed to register user" });
  }
};

/**
 * @desc    Auth user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Attempting login for email: ", email);
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      setAuthCookie(res, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      });
      console.log("User logged in successfully: ", user.username);
    } else {
      console.log("Invalid email or password for email: ", email);
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
  } catch (error) {
    console.error("Error during user login: ", error);
    res.status(401).json({ message: error.message });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Public
 */
const logout = (req, res) => {
  clearAuthCookie(res);
  console.log("User logged out successfully");
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { register, login, logout };