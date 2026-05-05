const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model('Book', new Schema({
  title:  { type: String, required: true },
  year:   { type: Number },
  author: { type: Schema.Types.ObjectId, ref: 'Author' },   // One-to-Many
  tags:   [{ type: Schema.Types.ObjectId, ref: 'Tag' }]     // Many-to-Many
}));
