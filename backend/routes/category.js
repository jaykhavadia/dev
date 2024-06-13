const express = require("express");
const categoryController = require("../controller/categoryController.js");
const route = express.Router();
const { auth } = require("../controller/authentication.js");

route.post("/create", auth, categoryController.addCategory);
route.get("/", categoryController.getAllCategories);

module.exports = route;
