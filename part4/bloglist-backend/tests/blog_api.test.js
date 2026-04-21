const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const api = supertest(app);
jest.setTimeout(100000);

let token = null; // Token save karne ke liye

beforeEach(async () => {
  // Database saaf karo
  await Blog.deleteMany({});
  await User.deleteMany({});

  // Ek test user banao
  const passwordHash = await bcrypt.hash("testpassword", 10);
  const user = new User({ username: "testuser", passwordHash });
  await user.save();

  // User ko login karwao aur token nikaalo
  const response = await api
    .post("/api/login")
    .send({ username: "testuser", password: "testpassword" });

  token = response.body.token; // Token mil gaya!

  // Ek initial blog daalo jo is user ka ho
  const newBlog = new Blog({
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    user: user._id,
  });
  await newBlog.save();
});

test("a valid blog can be added WITH a token", async () => {
  const newBlog = {
    title: "Test Blog with Token",
    author: "Test Author",
    url: "http://test.com",
    likes: 10,
  };

  // Post request mein .set('Authorization', ...) lagana zaroori hai
  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(2);
});

test("fails with status code 401 if token is missing", async () => {
  const newBlog = {
    title: "No Token Blog",
    author: "Hacker",
    url: "http://hacked.com",
  };

  // Bina token bheje try karo, 401 aana chahiye
  await api.post("/api/blogs").send(newBlog).expect(401);
});

afterAll(async () => {
  await mongoose.connection.close();
});
