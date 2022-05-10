const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  id: String,
  password: String
});

const UserModel = mongoose.model('User', userSchema);

module.exports = { UserModel };