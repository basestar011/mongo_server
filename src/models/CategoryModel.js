const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
  code: Number,
  name: String,
  description: String,
  parent: Number
});
const Category = mongoose.model('Category', categorySchema);

module.exports = { Category };