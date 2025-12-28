const { Router } = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
// const channelRoutes = require("./channelRoutes");
// const messageRoutes = require("./messageRoutes");

const router = Router();
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
// router.use("/chat", channelRoutes);
// router.use("/message", messageRoutes);

router.get("/", (req, res) => {
  res.send("Welcome to the API");
});

module.exports = router;