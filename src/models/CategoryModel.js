const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
  code: String,
  name: String
});
const CategoryModel = mongoose.model('category', categorySchema);

module.exports = { CategoryModel };