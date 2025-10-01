const express = require("express");
const route = express.Router();
const user_functions = require("../controllers/user_controllers/user_controllers.js");
const middlewares = require("../middlewares/auth_user.js");

route.get("/ping", user_functions.pingTrigger);
route.post("/signin", user_functions.sign_user);
route.post("/login", user_functions.login_user);
route.post("/logout", middlewares.auth_user, user_functions.logout);
route.get("/:id", middlewares.auth_user, user_functions.getProfile);
route.patch("/profile/:id", middlewares.auth_user, user_functions.update);

module.exports = route;
