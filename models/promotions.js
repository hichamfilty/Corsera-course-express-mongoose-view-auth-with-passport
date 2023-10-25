const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const promoRouter = require('../routes/promoRouter');

const promoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    image: String,
  },
  label: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
  },
});

const Promotions = mongoose.model('Promotion', promoSchema);

promoSchema.plugin(passportLocalMongoose);

module.exports = Promotions;
