const mongoose = require('mongoose');

const mediaSchema = mongoose.Schema({
  id: String, // s3 key
  name: String, // file name
  path: String, // file path(s3 folder)
  srclink: String, // file src link
  type: String, // file extension
  size: Number // file size
});

const Media = mongoose.model('Media', mediaSchema);

module.exports = { Media };