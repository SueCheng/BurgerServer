const mongoose = require("mongoose");
const { Schema } = mongoose;
const itemSchema = require("./ItemSchema");
const bcrypt = require("bcrypt-nodejs");

/*
const burgerConfigSchema = new Schema({
  salad: Number,
  bacon: Number,
  cheese: Number,
  meat: Number
});*/

const userSchema = new Schema({
  facebook: {
    facebookId: String
  },
  google: {
    googleId: String
  },
  local: {
    userName: String,
    hashedPassword: { type: String, select: false }
  },
  loginMethod: String,
  credit: { type: Number, default: 0 },
  shoppingCart: [itemSchema]
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.hashedPassword);
};

userSchema
  .virtual("local.password")
  .set(function(password) {
    this.local.hashedPassword = this.generateHash(password);
  })
  .get(function() {
    return "";
  });

if (!userSchema.options.toJSON) userSchema.options.toJSON = {};
userSchema.options.toJSON.transform = function(doc, ret, options) {
  if (ret && ret.local) delete ret.local.hashedPassword;
  return ret;
};
var User = mongoose.model("User", userSchema);

module.exports = User;
