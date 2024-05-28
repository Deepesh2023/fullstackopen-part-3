/* eslint-disable no-param-reassign, no-underscore-dangle */
/* eslint-disable no-console */

const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;
const phoneNumberPattern = /^\d{2,3}-\d+$/;

mongoose.set('strictQuery', false);

mongoose
  .connect(url)
  .then(() => {
    console.log('connection established.');
  })
  .catch((error) => {
    console.log('conneciton failed', error);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: (v) => phoneNumberPattern.test(v),
      message: 'Please provide the correct format',
    },
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
