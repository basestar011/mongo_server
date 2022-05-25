const mongoose = require('mongoose');

const contentSchema = mongoose.Schema({
  code: Number,
  title: String,
  detail: Object,
  cg_code: Number,
  created: Date,
  modified: Date
});

const Content = mongoose.model('Content', contentSchema);

module.exports = { Content };