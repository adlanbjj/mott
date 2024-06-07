const mongoose = require("mongoose");
require("dotenv").config();

const URI = process.env.DB_URI;

async function connectToDatabase() {
  try {
    await mongoose.connect(URI);
    console.log("Connected to database");
  } catch (e) {
    console.error("Failed to connect to database", e);
    throw e;
  }
}

module.exports = { connectToDatabase };
