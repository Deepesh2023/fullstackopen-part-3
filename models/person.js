const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log(url);

mongoose.set("strictQuery", false);

mongoose
  .connect(url)
  .then(() => {
    console.log("connection established.");
  })
  .catch((error) => {
    console.log("conneciton failed", error);
  });

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
