const express = require("express");
const addresController = require("../controller/addressController.js");
const route = express.Router();
const { auth } = require("../controller/authentication.js");

route.post("/create", auth, addresController.createAddress);
route.put("/", auth,addresController.updateAddress);
route.get("/", auth,addresController.getAddressByUserId);

module.exports = route;
