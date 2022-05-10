const mongoose = require('mongoose')

const codeSchema = mongoose.Schema({
  model: String,
  code: String
});

const CodeModel = mongoose.model('code', codeSchema);

module.exports = { CodeModel };