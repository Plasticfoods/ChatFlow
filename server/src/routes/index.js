const { Router } = require("express");
const authRoutes = require("./authRoutes");
// const channelRoutes = require("./channelRoutes");
// const userRoutes = require("./userRoutes");
// const messageRoutes = require("./messageRoutes");

const router = Router();
router.use("/auth", authRoutes);
// router.use("/chat", channelRoutes);
// router.use("/user", userRoutes);
// router.use("/message", messageRoutes);

router.get("/", (req, res) => {
  res.send("Welcome to the API");
});

module.exports = router;