const express = require("express");
const multer = require("multer");
const uploadFile = require("../controllers/upload_controllers/upload_controllers.js");
const User = require("../models/usermodel.js");
const user_controllers = require("../controllers/user_controllers/user_controllers.js");
const auth_user = require("../middlewares/auth_user.js");

const router = express.Router();

// Multer to handle file uploads to local "uploads/" folder
const upload = multer({ dest: "uploads/" });

// Route: POST /api/upload
//to make the upload route a protected route
router.post(
  "/upload",
  upload.single("file"),
  auth_user.auth_user,
  uploadFile.uploadFile
);

module.exports = router;
