const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

// Naya user banane ka route
usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  // Check 1: Password hona chahiye aur 3 characters se bada hona chahiye
  if (!password || password.length < 3) {
    return response
      .status(400)
      .json({ error: "password must be at least 3 characters long" });
  }

  // Check 2: Username bhi kam se kam 3 characters ka hona chahiye
  if (!username || username.length < 3) {
    return response
      .status(400)
      .json({ error: "username must be at least 3 characters long" });
  }

  // Password ko encrypt karna (SaltRounds 10 standard aur safe hota hai)
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  // User ko save karo
  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

// Saare users dekhne ka route
usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

module.exports = usersRouter;
