const express = require("express");
const routes = express.Router();
const middlewares = require("../middlewares/auth_user.js");
const admin_controllers = require("../controllers/admin_controllers/admincontrolls.js");

//authentication related routes
routes.post("/register", admin_controllers.registerAdmin);
routes.post("/login", admin_controllers.loginAdmin);
routes.post("/logout", middlewares.auth_user, admin_controllers.logout_admin);
//controlling routes
routes.get("/users", admin_controllers.getAllUsers);
module.exports = routes;
