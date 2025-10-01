const express = require("express");
const app = express();
const cors = require("cors");
// const uploadRoutes = require("./routes/upload_routes.js");
const uploadFile = require("./routes/upload_routes.js");
const user_endpoints = require("../server/routes/user_routes.js");
const admin_endpoints = require("./routes/admin_routes.js");
const cookieParser = require("cookie-parser");
//front end CORS setting
// ✅ Put CORS before routes
app.use(
  cors({
    origin: "http://localhost:5173", // React dev server
    credentials: true, // allow cookies if using auth
  })
);
//adding document middleware
app.use(cookieParser());
// allow up to 10MB payload
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

//user entry point
app.use("/home", user_endpoints);
//admin entry point
app.use("/admin", admin_endpoints);
//upload routes
app.use("/api", uploadFile);

module.exports = app;
