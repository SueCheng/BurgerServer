const mongoose = require("mongoose");
const { Schema } = mongoose;
const itemSchema = require("./ItemSchema");

const OrderSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: "User" },
  totalPrice: Number,
  address: String,
  status: String,
  items: [itemSchema]
});

var Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
