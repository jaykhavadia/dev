const express = require("express");
const create = require("../controller/userController.js");
const route = express.Router();

route.post("/register", create.createUser);
route.post("/login", create.loginUser);
route.post("/me", create.me);
route.get("/verifyemail/:token", create.verifyUser);
route.post("/resend-verfication", create.resendVerificationEmail);
route.post("/contact-us", create.contactUs);
module.exports = route;
