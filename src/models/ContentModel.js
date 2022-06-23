const mongoose = require('mongoose');

const contentSchema = mongoose.Schema({
  code: Number,
  title: String,
  detail: Object,
  date: Date,
  cg_code: Number,
  created: Date,
  modified: Date
}, { toJSON: { virtuals: true }, toObject: { virtuals: true }, id: false });

contentSchema.virtual('images', {
  ref: 'Media',
  localField: 'code',
  foreignField: 'ct_code',
});

const Content = mongoose.model('Content', contentSchema);

module.exports = { Content };