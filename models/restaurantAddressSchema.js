const mongoose = require("mongoose");
const { Schema } = mongoose;

const restaurantAddressSchema = new Schema({
  address: String
});

var model = mongoose.model("RestaurantAddress", restaurantAddressSchema);
module.exports = model;
