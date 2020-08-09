const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
  name: String,
  title: String,
  image: String,
  imagedos: String,
  imagetres: String,
  description: String,
  color: String,
  talle:  String,
  colorstock: String,
  tallestock: String,
  price: Number,
  amount: Number,
  filtroprice: Number,
  status: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Ofertatres', NoteSchema);
