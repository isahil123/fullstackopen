const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.PORT;

// Agar test chal raha hai toh TEST_MONGODB_URI use karo, warna normal MONGODB_URI
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "MongoDB URI is missing. Set TEST_MONGODB_URI for tests or MONGODB_URI for development.",
  );
}

module.exports = {
  MONGODB_URI,
  PORT,
};
