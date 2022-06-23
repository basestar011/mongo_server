const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
  code: Number,
  name: String,
  description: String,
  parent: Number
}, { toJSON: { virtuals: true }, toObject: { virtuals: true }, id: false });

categorySchema.virtual('contCount', {
  ref: 'Content',
  localField: 'code',
  foreignField: 'cg_code',
  count: true
});

categorySchema.virtual('contents', {
  ref: 'Content',
  localField: 'code',
  foreignField: 'cg_code'
})

const Category = mongoose.model('Category', categorySchema);

module.exports = { Category };