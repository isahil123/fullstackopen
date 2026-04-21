const express = require("express");
const usersRouter = require("./controllers/users");
const app = express();
const cors = require("cors");
const blogsRouter = require("./controllers/blogs");
const loginRouter = require("./controllers/login");

app.use(cors());
app.use(express.json());

// Saare /api/blogs wale requests seedha blogsRouter ke paas jayenge
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
module.exports = app;
