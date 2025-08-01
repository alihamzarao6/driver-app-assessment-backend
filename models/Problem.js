const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemType: {
      type: String,
      required: true,
      enum: [
        "Client unavailable",
        "Damage during transport",
        "Access problem",
        "Other problem",
      ],
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "escalated"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Problem", problemSchema);
