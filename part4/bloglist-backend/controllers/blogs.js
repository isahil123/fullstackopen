const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;

  // Agar title ya url nahi hai, toh 400 Bad Request bhej do
  if (!body.title || !body.url) {
    return response.status(400).end();
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0, // Agar likes nahi bheja toh 0 set kar do
  });

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});
// Ex 4.13: Blog delete karne ka code
blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end(); // 204 matlab 'No Content' (Successfully deleted)
});

// Ex 4.14: Blog update (likes badhane) ka code
blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  // { new: true } lagana zaroori hai taaki Mongoose update hone ke baad naya data bheje
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog);
});
module.exports = blogsRouter;
