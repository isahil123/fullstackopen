const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/api/blogs", (request, response) => {
  response.send("<h1>Hello Part 4! Blog List Backend is alive!</h1>");
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
