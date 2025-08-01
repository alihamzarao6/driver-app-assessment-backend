const mongoose = require("mongoose");
require("dotenv").config();

// Import models
const User = require("./models/User");
const Problem = require("./models/Problem");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/driver_app")
  .then(() => console.log("MongoDB Connected for seeding"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const seedData = async () => {
  try {
    const userId = "688cbe19d496e4486fe12b3b"; // Your user ID

    // 1. Update user profile with better stats
    await User.findByIdAndUpdate(userId, {
      stats: {
        ordersCompleted: 47,
        rating: 4.8,
        workExperience: "2 years 3 months",
      },
    });

    console.log("✅ User profile updated with better stats");

    // 2. Create sample problem reports
    const sampleProblems = [
      {
        orderId: "ORD-2024-001",
        userId: userId,
        problemType: "Client unavailable",
        description:
          "Customer was not at the delivery address. Waited for 15 minutes but no response.",
        status: "resolved",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        orderId: "ORD-2024-002",
        userId: userId,
        problemType: "Damage during transport",
        description:
          "Package got damaged due to rough handling during transit. Customer refused delivery.",
        status: "escalated",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        orderId: "ORD-2024-003",
        userId: userId,
        problemType: "Access problem",
        description:
          "Building gate was locked and security was not available. Could not access delivery location.",
        status: "resolved",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        orderId: "ORD-2024-004",
        userId: userId,
        problemType: "Other problem",
        description:
          "GPS coordinates were incorrect. Spent 30 minutes finding the correct address.",
        status: "pending",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        orderId: "ORD-2024-005",
        userId: userId,
        problemType: "Client unavailable",
        description:
          "Customer requested delivery reschedule via phone call during delivery attempt.",
        status: "resolved",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        orderId: "32845", // This matches your demo order ID
        userId: userId,
        problemType: "Damage during transport",
        description:
          "Package corner was slightly damaged during loading. Customer accepted delivery with note.",
        status: "pending",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
    ];

    // Delete existing problems for this user first
    await Problem.deleteMany({ userId: userId });

    // Insert new sample problems
    await Problem.insertMany(sampleProblems);

    console.log("✅ Sample problem reports created");
    console.log(`📊 Created ${sampleProblems.length} problem reports`);
    console.log(
      "📈 Updated user stats: 47 orders, 4.8 rating, 2y 3m experience"
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

// Run the seeding
seedData();
