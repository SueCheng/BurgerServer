const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  facebookId: String,
  googleId: String
});

var User = mongoose.model("User", userSchema);

module.exports = User;
