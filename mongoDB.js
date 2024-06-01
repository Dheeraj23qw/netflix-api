const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.DATABASE_URL;

async function connectToDB() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = { connectToDB };
