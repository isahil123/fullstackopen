const express = require("express");
const usersRouter = require("./controllers/users");
const app = express();
const cors = require("cors");
const blogsRouter = require("./controllers/blogs");
const loginRouter = require("./controllers/login");
const middleware = require("./utils/middleware");

app.use(cors());
app.use(express.json());

// Saare /api/blogs wale requests seedha blogsRouter ke paas jayenge
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use(middleware.tokenExtractor);

module.exports = app;
