const mongoose = require('mongoose');
module.exports = mongoose.model('Author', new mongoose.Schema({
  name:  { type: String, required: true },
  email: { type: String, required: true }
}));
