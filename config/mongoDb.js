const mongoose = require("mongoose");
require("dotenv").config();

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("MongoDB Error:", error.message);
  }
};

module.exports = connectMongoDB;