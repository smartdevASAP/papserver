const express = require("express");
const Admin = require("../../models/adminmodel.js");
const Users = require("../../models/usermodel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//registering admin
exports.registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if an admin already exists
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message:
          "Only one admin is allowed. Ask for permission to be onboarded.",
      });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Create the admin
    const admin = await Admin.create({
      email,
      password: hashedPassword,
    });
    //JWT setting;
    const token = jwt.sign({ id: admin._id }, process.env.SECRET_STR, {
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
      message: "Admin registered successfully",
      admin,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error occurred in registering the admin: " + err.message,
    });
  }
};
//logging in admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //JWT setting;
    const token = jwt.sign({ id: admin._id }, process.env.SECRET_STR, {
      expiresIn: "2d",
    });
    //cookie setting;
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 3600 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      admin,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error occurred in logging in the admin: " + err.message,
    });
  }
};

//logout admin
exports.logout_admin = async (req, res) => {
  try {
    //a protected route that has a middleware before the execution of the controller function
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
    return res.status(500).json({
      success: false,
      message: "error occured: " + err.message,
    });
  }
};

//getting all the users;
exports.getAllUsers = async (req, res) => {
  try {
    //finding all the users
    const allUsers = await Users.find({});
    if (!Users) {
      return res.status(200).json({
        success: true,
        message: "there are no users currently",
      });
    }
    //if there are users;
    res.status(200).json({
      success: true,
      total_users: Users.length + 1,
      allUsers,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "error occured: " + err.message,
    });
  }
};
