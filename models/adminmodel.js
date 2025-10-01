const mongoose = require("mongoose");

const adminModel = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [5, "Password must be at least 5 characters long"],
  },
});

const Admin = mongoose.model("Admin", adminModel);
module.exports = Admin;
