const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  id: String,
  password: String
});

const User = mongoose.model('User', userSchema);

module.exports = { User };