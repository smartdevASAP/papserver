const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../../models/usermodel.js");
const bcrypt = require("bcryptjs");
//const route testing
exports.pingTrigger = (req, res) => {
  res.status(200).json({
    status: "true",
    message: "API is working",
  });
};
//user related endpoints;
//creating a new user in the DB;
exports.sign_user = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //missing fields;
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "missing infromation from the fields",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    //JWT setting;
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_STR, {
      expiresIn: "2d",
    });
    //cookie setting;
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 3600 * 1000,
    });
    res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (err) {
    console.log(err.message);
    //400 0r 500
    return res.status(500).json({
      success: false,
      message: `error is ${err.message}`,
    });
  }
};

//login in a user
exports.login_user = async (req, res) => {
  const { email, password } = req.body;
  //missing fields;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "missing details in the input form",
    });
  }
  const found_user = await User.findOne({ email });
  if (!found_user) {
    return res.status(404).json({
      status: false,
      message: `user with email ${email} not found please return to sign in`,
    });
  }
  //when the user is in the DB
  const isMatch = await bcrypt.compare(password, found_user.password);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "invalid password provided",
    });
  }
  //********forgot to add the bcrypt.compare() here */
  try {
    //JWT setting;
    const token = jwt.sign({ id: found_user._id }, process.env.SECRET_STR, {
      expiresIn: "2d",
    });
    //cookie setting;
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 3600 * 1000,
    });

    res.status(201).json({
      success: true,
      user: found_user,
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: `error occured: ${err.message}`,
    });
  }
};

//get profile;
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "no user with such ID found in the database",
      });
    }
    res.status(200).json({
      success: true,
      foundUser,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "error occured: " + err.message,
    });
  }
};

//updating the existing credentials;
exports.update = async (req, res) => {
  try {
    // to extract param from URL
    const { id } = req.params;

    // Grab update fields from request body
    let { email, password, username } = req.body;

    // hash the password if it's provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { email, password, username },
      { new: true, runValidators: true }
      // returns updated doc & validates schema 👆
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error occurred: " + err.message,
    });
  }
};

//logout in a user;
exports.logout = async (req, res) => {
  try {
    //clearingthe cookie for the log out function
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    //API response;
    res.status(200).json({
      success: true,
      message: "logged out succesfully",
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: `error occured ${err.message}`,
    });
  }
};
//forgot password;
exports.forgot_password = async (req, res) => {
  const { email } = req.body;
  //get the user from the DB
  const found_user = await User.findOne({ email });
  if (!found_user) {
    return res.status(404).json({
      success: false,
      message: `user with email ${email} is not logged in. Please return to login`,
    });
  }
  //when the user exists
  try {
    const { new_password } = req.body;
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
