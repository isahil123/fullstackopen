require("dotenv").config(); // Step 1: Env load karo
const express = require("express"); // Step 2: Express lao
const cors = require("cors");
const morgan = require("morgan");
// Person ko sabse end mein lao taaki tab tak MONGODB_URI ready ho chuka ho
const Person = require("./models/person");

const app = express();
// ... baaki pura same code

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());

morgan.token("postData", (request) => {
  if (request.method === "POST") return JSON.stringify(request.body);
  return "";
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postData",
  ),
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

app.get("/info", (request, response) => {
  Person.countDocuments({}).then((count) => {
    response.send(
      `<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`,
    );
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) =>
      person ? response.json(person) : response.status(404).end(),
    )
    .catch((error) => next(error));
});

// Fixed Typo: aapp -> app
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  if (!body.name || !body.number)
    return response.status(400).json({ error: "missing info" });

  const person = new Person({ name: body.name, number: body.number });
  person
    .save()
    .then((saved) => response.json(saved))
    .catch((error) => next(error));
});

// Exercise 3.17: Update existing person (PUT)
app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" },
  )
    .then((updatedPerson) => response.json(updatedPerson))
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
