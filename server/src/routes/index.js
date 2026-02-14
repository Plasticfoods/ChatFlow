const { Router } = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const channelRoutes = require("./channelRoutes");
const messageRoutes = require("./messageRoutes");

// For testing purposes
const Channel = require("../models/channel.model");

const router = Router();
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/channel", channelRoutes);
router.use("/message", messageRoutes);

router.get("/", (req, res) => {
  res.send("Welcome to the API");
});

router.get("/test", async (req, res) => {
  try {
    const result = await Channel.updateMany(
      {}, // Match all documents
      { 
        $set: { 
          isDeleted: false, 
          deletedBy: [] 
        } 
      }
    );
    console.log(result);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;