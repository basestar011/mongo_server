const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
  code: Number,
  name: String,
  parent: Number
});
const Category = mongoose.model('Category', categorySchema);

module.exports = { Category };