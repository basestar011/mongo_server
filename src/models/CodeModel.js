const mongoose = require('mongoose')

const codeSchema = mongoose.Schema({
  model: String,
  code: Number
});

const Code = mongoose.model('Code', codeSchema);

module.exports = { Code };