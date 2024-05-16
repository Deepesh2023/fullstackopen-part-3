const express = require("express");
const cors = require("cors");

var morgan = require("morgan");
morgan.token("post_data", (request) => {
  return JSON.stringify(request.body);
});

const app = express();

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());
app.use(morgan(":method :url :status :response-time :post_data"));

const PORT = process.env.PORT || 3001;

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  if (persons.length > 0) {
    const exsistingIds = persons.map((person) => person.id);
    const maxId = Math.max(...exsistingIds);

    return Math.floor(Math.random(100 - maxId + 1) + maxId + 1);
  }

  return 0;
};

app.get("/dist/index.html", (request, response) => {
  response.status(200).end();
});

app.get("/info", (request, response) => {
  const date = new Date();
  const info = `<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`;
  response.send(info);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
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
  } else if (persons.some((person) => person.name === request.body.name)) {
    response.status(400).json({ error: "name already present" });
    return;
  }

  const newPerson = {
    id: generateId(),
    name: request.body.name,
    number: request.body.number,
  };

  persons = persons.concat(newPerson);
  response.status(201).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
