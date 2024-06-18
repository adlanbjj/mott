const mongoose = require("mongoose");
const Posts = require("./Posts");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: function() { 
      return this.isNew || this.isModified('password'); 
    }
  },
  location: String,
  age: Number,
  avatar: String,
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
