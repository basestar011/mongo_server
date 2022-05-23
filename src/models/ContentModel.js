const mongoose = require('mongoose');

class Space {
  constructor(address, description) {
    this.address = address;
    this.description = description;
  }
}

class Restaurant extends Space {
  constructor(address, description, menu) {
    super(address, description);
    this.menu = menu;
  }
}

const contentSchema = mongoose.Schema({
  code: Number,
  title: String,
  detail: Object,
  cg_code: Number
});

const Content = mongoose.model('Content', contentSchema);

module.exports = { Content, Space, Restaurant };