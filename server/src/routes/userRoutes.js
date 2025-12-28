const {  Router } = require("express");
const router = Router();
const { searchUsers, getUserProfile, updateUserProfile } = require("../controllers/userController");
const { checkAuthentication, checkAuthorization } = require("../middleware/authMiddleware");

// @route   GET /api/user?search=john
router.get("/", checkAuthentication, searchUsers);

// @route   GET /api/user/profile
router.get("/profile", checkAuthentication, getUserProfile);

// @route   PUT /api/user/profile
router.put("/profile", checkAuthentication, checkAuthorization(["user"]), updateUserProfile);

module.exports = router;