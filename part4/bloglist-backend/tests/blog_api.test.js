const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");

const api = supertest(app);
jest.setTimeout(100000);

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://dijkstra.com",
    likes: 5,
  },
];

// Har test se pehle database saaf karo aur 2 initial blogs daal do
beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

// Ex 4.9: _id ki jagah id hona chahiye
test("unique identifier property of the blog posts is named id", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body[0].id).toBeDefined();
});

// Ex 4.10: Naya blog successfully add hota hai
test("a valid blog can be added", async () => {
  const newBlog = {
    title: "Test Blog",
    author: "Test Author",
    url: "http://test.com",
    likes: 10,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(initialBlogs.length + 1); // Ek blog badh gaya

  const titles = response.body.map((r) => r.title);
  expect(titles).toContain("Test Blog"); // Naya title database mein hai
});

// Ex 4.11: Agar likes nahi bheja toh default 0 hona chahiye
test("if likes property is missing, it defaults to 0", async () => {
  const newBlog = {
    title: "No Likes Blog",
    author: "Test Author",
    url: "http://nolikes.com",
  };

  const response = await api.post("/api/blogs").send(newBlog).expect(201);
  expect(response.body.likes).toBe(0);
});

// Ex 4.12: Title ya URL missing ho toh 400 aana chahiye
test("blog without title or url is not added", async () => {
  const newBlog = { author: "Test Author" }; // Title aur URL dono missing hain

  await api.post("/api/blogs").send(newBlog).expect(400);
});
// Ex 4.13: Delete test
test("fails with 204 if a valid id is deleted", async () => {
  // Pehle saare blogs nikaalo aur pehla blog select karo
  const blogsAtStart = await api.get("/api/blogs");
  const blogToDelete = blogsAtStart.body[0];

  // Delete request bhejo
  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  // Phir se saare blogs nikaalo check karne ke liye
  const blogsAtEnd = await api.get("/api/blogs");

  // Check karo ki length 1 kam ho gayi ho aur title na mile
  expect(blogsAtEnd.body).toHaveLength(blogsAtStart.body.length - 1);
  const titles = blogsAtEnd.body.map((r) => r.title);
  expect(titles).not.toContain(blogToDelete.title);
});

// Ex 4.14: Put (Update) test
test("succeeds in updating the likes of a blog", async () => {
  const blogsAtStart = await api.get("/api/blogs");
  const blogToUpdate = blogsAtStart.body[0];

  // Purane blog mein 50 likes aur add kar do
  const updatedData = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 50,
  };

  // Put request bhejo
  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200);

  // Check karo ki naye likes update hue ya nahi
  expect(response.body.likes).toBe(blogToUpdate.likes + 50);
});
afterAll(async () => {
  await mongoose.connection.close();
});
