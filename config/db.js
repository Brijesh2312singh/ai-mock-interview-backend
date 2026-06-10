const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB Connected ✅");
    console.log("Database:", mongoose.connection.name);
  } catch (error) {
    console.log("MongoDB Error ❌:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;