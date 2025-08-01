const Problem = require("../models/Problem");

// submit problem report
const submitProblemReport = async (req, res) => {
  try {
    const { orderId, problemType, description } = req.body;

    const problem = new Problem({
      orderId,
      problemType,
      description,
      userId: req.userId,
    });

    await problem.save();

    res.status(201).json({
      message: "Problem reported successfully",
      problem,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's problem reports
const getUserProblemReports = async (req, res) => {
  try {
    const problems = await Problem.find({ userId: req.userId }).sort({
      createdAt: -1,
    });

    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  submitProblemReport,
  getUserProblemReports,
};
