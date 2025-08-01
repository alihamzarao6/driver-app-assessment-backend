const express = require("express");
const auth = require("../middleware/auth");
const { getUserProfile, updateUserProfile } = require("../controllers/profile");

const router = express.Router();

router.get("/", auth, getUserProfile);
router.put("/", auth, updateUserProfile);

module.exports = router;
