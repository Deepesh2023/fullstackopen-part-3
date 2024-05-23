const express = require("express");
const cors = require("cors");

require("dotenv").config();
const Person = require("./models/person");

var morgan = require("morgan");
morgan.token("post_data", (request) => {
  return JSON.stringify(request.body);
});

const app = express();

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
app.use(morgan(":method :url :status :response-time :post_data"));

const PORT = process.env.PORT;

app.get("/dist/index.html", (request, response) => {
  response.status(200).end();
});

app.get("/info", (request, response) => {
  const date = new Date();
  const info = `<p>Phonebook has info for ${Person.length} people</p> <p>${date}</p>`;
  response.send(info);
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    console.log(result);
    response.json(result);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  if (!request.body.name || !request.body.number) {
    response.status(400).json({ error: "please provide correct data" });
    return;
  }

  const newPerson = new Person({
    name: request.body.name,
    number: request.body.number,
  });

  newPerson.save().then((result) => {
    response.json(result);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
