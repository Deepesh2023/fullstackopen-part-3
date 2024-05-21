const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("please provide password");
  process.exit(1);
}

const password = process.argv[2];
const URL = `mongodb+srv://theinternetnivasi:${password}@phonebook.ja9gt2r.mongodb.net/phonebook?retryWrites=true&w=majority&appName=phonebook`;

mongoose.set("strictQuery", false);
mongoose.connect(URL);

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("Phonebook");
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
