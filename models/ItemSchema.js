const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new Schema({
  category: String,
  quantity: Number,
  price: Number,
  config: { type: Map, of: String }
});

module.exports = itemSchema;
