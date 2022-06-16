const mongoose = require('mongoose');

const mediaSchema = mongoose.Schema({
  id: String,
  name: String
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = { Media };