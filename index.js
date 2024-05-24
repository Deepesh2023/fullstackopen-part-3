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
  Person.countDocuments({})
    .then((result) => {
      const info = `<p>Phonebook has info for ${result} people</p> <p>${date}</p>`;
      response.send(info);
    })
    .catch((error) => next(error));
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((result) => {
    response.json(result);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((result) => response.json(result))
    .catch((error) => next(error));
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

  newPerson
    .save()
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndUpdate(request.params.id, request.body, { new: true })
    .then((result) => {
      response.json(result).status(204);
    })
    .then((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.json(result).status(204);
    })
    .catch((error) => next(error));
});

const unknownEndPoint = (request, response) => {
  response.status(404).send("<h1>Page not found</h1>");
};

app.use(unknownEndPoint);

const errorHandling = (error, request, response, next) => {
  if (error.name === "CastError") {
    console.log(error.message);
    return response
      .status(400)
      .send({ error: "person mentioned not available in phonbook" });
  }

  next(error);
};

app.use(errorHandling);

app.listen(PORT, () => {
  console.log("server is running on", PORT);
});
