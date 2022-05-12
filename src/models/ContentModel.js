const mongoose = require('mongoose');

const contentSchema = mongoose.Schema({
  title: String,
  detail: Object,
  category_id: Number
});

const Content = mongoose.model('Content', contentSchema);

module.exports = { Content };