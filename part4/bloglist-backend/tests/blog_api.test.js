const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const config = require("../utils/config");

// Supertest hamare app ko bina port pe chalaye test karne deta hai
const api = supertest(app);

beforeAll(async () => {
  await mongoose.connect(config.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

// Test khatam hone ke baad database connection band karna zaroori hai
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});
