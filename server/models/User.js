const mongoose = require("mongoose");
const Posts = require("./Posts");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: String,
  age: Number,
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    await Posts.deleteMany({ author: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
