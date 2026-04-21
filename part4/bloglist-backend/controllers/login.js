const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  // 1. User ko database mein dhoondo
  const user = await User.findOne({ username });

  // 2. Check karo ki user mila aur password match hua ya nahi
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  // 3. Agar sab theek hai, toh Token ke liye data banao
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  // 4. Token generate karo (.env wale secret ka use karke)
  const token = jwt.sign(userForToken, process.env.SECRET);

  // 5. User ko token bhej do
  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
