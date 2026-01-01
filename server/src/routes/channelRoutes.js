const {  Router } = require("express");
const router = Router();
const { checkAuthentication, checkAuthorization } = require("../middlewares/auth");
const { accessChannel, createGroupChannel, deleteChannel } = require("../controllers/channelController");

// @route POST /api/channel
router.post("/", checkAuthentication, checkAuthorization(["user"]), accessChannel);

// @route POST /api/channel/group
router.post("/group", checkAuthentication, checkAuthorization(["user"]), createGroupChannel);

// @route DELETE /api/channel/:channelId
router.delete("/:channelId", checkAuthentication, checkAuthorization(["user", "admin"]), deleteChannel);

module.exports = router;