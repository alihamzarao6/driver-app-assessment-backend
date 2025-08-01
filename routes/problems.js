const express = require("express");
const auth = require("../middleware/auth");
const {
  getUserProblemReports,
  submitProblemReport,
} = require("../controllers/problems");

const router = express.Router();

router.post("/", auth, submitProblemReport);
router.get("/", auth, getUserProblemReports);

module.exports = router;
