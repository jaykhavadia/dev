const express = require("express");
const couponController = require("../controller/couponController.js");
const route = express.Router();
const { auth } = require("../controller/authentication.js");

route.post("/create", auth, couponController.createCouponByAdmin);
route.get("/", auth, couponController.getAllCoupons);
route.put("/update/:id", auth, couponController.updateCoupon);
route.get("/:title/:grandTotal", auth, couponController.getCouponByTitleAndGrandTotal);
route.get("/:title", auth, couponController.getCouponByTitle);
route.delete("/remove/:id", auth, couponController.removeCoupon);
module.exports = route;
