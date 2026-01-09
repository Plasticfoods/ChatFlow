const {  Router } = require("express");
const router = Router();
const { checkAuthentication, checkAuthorization } = require("../middlewares/auth");
const { sendMessage, getMessages } = require("../controllers/messageController");

// @route POST /api/message
router.post("/", checkAuthentication, checkAuthorization(["user"]), sendMessage);

// @route GET /api/message/:channelId
router.get("/:channelId", checkAuthentication, checkAuthorization(["user"]), getMessages);

module.exports = router;