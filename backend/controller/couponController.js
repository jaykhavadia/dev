const Coupon = require("../model/couponModel");
const moment = require("moment");

module.exports.createCouponByAdmin = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res
        .status(403)
        .json({ message: "You don't have permission to access this route!" });

    const {
      title,
      value,
      type,
      startingDate,
      endingDate,
      minimumPurchasingPrice,
    } = req.body;
    if (
      !title ||
      !value ||
      !type ||
      !startingDate ||
      !endingDate ||
      !minimumPurchasingPrice
    ) {
      return res.status(404).json({ message: "Required Payload not found" });
    }
    const checkCouponNameExists = await Coupon.findOne({ title });
    if (checkCouponNameExists) {
      return res.status(400).json({ message: "Coupon CODE already exists" });
    }
    let payload = {
      title,
      value,
      type,
      startingDate,
      endingDate,
      minimumPurchasingPrice,
      userId: req.user._id,
    };
    if (type === "Percentage") {
      payload.maximumDiscountPrice = req.body.maximumDiscountPrice;
    }
    const coupon = new Coupon(payload);

    const couponDetail = await coupon.save();
    return res
      .status(200)
      .json({ message: "New Coupon Created successfully..! ", couponDetail });
  } catch (error) {
    console.log("createCouponByAdmin error", error);
    return res.status(500).json(error);
  }
};

module.exports.getAllCoupons = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res
        .status(403)
        .json({ message: "You don't have permission to access this route!" });

    const allCoupons = await Coupon.find({});

    return res
      .status(200)
      .json({ message: "All coupons fetched successfully!", allCoupons });
  } catch (error) {
    console.log("getAllCoupons [Error]", error);
  }
};

module.exports.updateCoupon = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res
        .status(403)
        .json({ message: "You don't have permission to access this route!" });

    const {
      title,
      value,
      type,
      startingDate,
      endingDate,
      status,
      minimumPurchasingPrice,
    } = req.body;

    if (
      !title ||
      !value ||
      !type ||
      !startingDate ||
      !endingDate ||
      !minimumPurchasingPrice
    ) {
      return res.status(404).json({ message: "Required Payload not found" });
    }

    const checkCouponNameExists = await Coupon.find({ title });
    if (checkCouponNameExists.length > 1) {
      return res.status(400).json({ message: "Coupon name already exists" });
    }

    let payload = {
      title,
      value,
      type,
      startingDate,
      endingDate,
      minimumPurchasingPrice,
    };
    if (status) {
      payload.status = status;
    }
    if (type === "Percentage") {
      payload.maximumDiscountPrice = req.body.maximumDiscountPrice;
    }
    const couponDetail = await Coupon.findByIdAndUpdate(
      { _id: req.params.id },
      payload,
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Coupon Updated successfully !", couponDetail });
  } catch (error) {
    console.log("updateCoupon [Error]", error);
  }
};

module.exports.getCouponByTitleAndGrandTotal = async (req, res) => {
  try {
    const grandTotal = req.params.grandTotal;
    const couponDetail = await Coupon.findOne({ title: req.params.title });

    if (!couponDetail) {
      return res.status(404).json({ message: "Coupon Not Found!" });
    }
    if (couponDetail.status !== "Active") {
      return res.status(404).json({ message: "Coupon Expired!" });
    }

    const currentDate = moment().format("DD-MM-YY");
    const startingDate = moment(couponDetail.startingDate).format("DD-MM-YY");
    const endingDate = moment(couponDetail.endingDate).format("DD-MM-YY");

    if (
      currentDate === startingDate ||
      currentDate === endingDate ||
      (currentDate >= startingDate && currentDate <= endingDate)
    ) {
      if (
        grandTotal >= couponDetail.minimumPurchasingPrice &&
        couponDetail.type === "Percentage"
      ) {
        let totalDiscountedPrice = (grandTotal * couponDetail.value) / 100;
        if (totalDiscountedPrice <= couponDetail.maximumDiscountPrice) {
          return res.status(200).json({
            message: "Coupon Applied Successfully!",
            couponDetail,
            totalDiscountedPrice,
          });
        } else if (totalDiscountedPrice > couponDetail.maximumDiscountPrice) {
          totalDiscountedPrice = couponDetail.maximumDiscountPrice;
          return res.status(200).json({
            message: "Coupon Applied Successfully!",
            couponDetail,
            totalDiscountedPrice,
          });
        }
      } else if (
        grandTotal >= couponDetail.minimumPurchasingPrice &&
        couponDetail.type === "fixedAmount"
      ) {
        totalDiscountedPrice = couponDetail.value;
        return res.status(200).json({
          message: "Coupon Applied Successfully!",
          couponDetail,
          totalDiscountedPrice,
        });
      }
      return res.status(400).json({
        message: `Please purchase minimum of Rs ${couponDetail.minimumPurchasingPrice} for this coupon ${req.params.title}`,
      });
    }

    return res.status(400).json({ message: "Invalid Coupon!" });
  } catch (error) {
    console.log("getCouponByTitle [Error]", error);
    return res
      .status(500)
      .json({ message: "Something went wrong,Try after some time!" });
  }
};

module.exports.getCouponByTitle = async (req, res) => {
  try {
    const couponDetail = await Coupon.findOne({
      title: req.params.title,
      status: "Active",
    });

    if (!couponDetail) {
      return res.status(404).json({ message: "Coupon Not Found!" });
    }

    return res.status(200).json({
      message: "Coupon Found!",
      couponDetail,
    });
  } catch (error) {
    console.log("getCouponByTitleAndGrandTotal [Error]", error);
    return res
      .status(500)
      .json({ message: "Something went wrong,Try after some time!" });
  }
};

module.exports.removeCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found !" });
    await Coupon.deleteOne({ _id: req.params.id });
    return res
      .status(200)
      .json({ message: `${coupon.title} Coupon Removed successfully !` });
  } catch (error) {
    console.log("removeCoupon [Error]", error);
  }
};

// const updateExpiredCoupons = async () => {
//   try {
//     console.log("updateExpiredCoupons Function called !")
//     const currentDate = new Date();

//     const result = await Coupon.updateMany(
//       {
//         endingDate: { $lt: currentDate },
//         status: 'Active',
//       },
//       {
//         $set: { status: 'Expired' },
//       }
//     );
//     console.log(`${result.nModified} coupons updated.`);
//   } catch (error) {
//     console.error('Error updating coupons:', error);
//   }
// };

// setInterval(() => {

//   // Call the function (for example, you might call it on a schedule or trigger)
//   updateExpiredCoupons();

// }, 1000);
