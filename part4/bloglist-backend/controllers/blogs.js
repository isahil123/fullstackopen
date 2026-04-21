const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const jwt = require("jsonwebtoken"); // <-- Security ke liye
const middleware = require("../utils/middleware"); // <-- Security ke liye

// GET Route - Saare blogs dekhne ke liye
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

// POST Route - Naya blog add karna (Sirf logged-in user ke liye)
blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user; // Middleware se nikala hua user

  // Agar token/user nahi hai, toh bhaga do
  if (!user) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  // Agar title ya url nahi hai, toh 400 Bad Request
  if (!body.title || !body.url) {
    return response.status(400).end();
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id, // <-- Blog ko user ke account se jod diya
  });

  const savedBlog = await blog.save();

  // User ke data mein bhi is blog ki ID save karni hai
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

// DELETE Route - Blog delete karna (Sirf wahi user karega jisne banaya hai)
blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;
    const blog = await Blog.findById(request.params.id);

    if (!user) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    // Security Check: Agar blog banane wala aur delete karne wala alag hain, toh error do
    if (blog.user.toString() !== user.id.toString()) {
      return response
        .status(403)
        .json({ error: "only the creator can delete this blog" });
    }

    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  },
);

// PUT Route - Blog update (likes badhane) ka code
blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
