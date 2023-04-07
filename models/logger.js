const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const userModel = require("../userModel")

const loggerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'pokeusers',
  },
  date: { type: Date, default: Date.now },
  method: String,
  url: String,
  status: Number,
  responseTime: Number
});


const Logger = mongoose.model('logger', loggerSchema);

module.exports = Logger;