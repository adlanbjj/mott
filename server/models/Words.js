const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  latin: { type: String, required: true },
  cyrillic: { type: String, required: true },
  translation: { type: String, required: true }
});

const Words = mongoose.model('Words', wordSchema);

module.exports = Words;
