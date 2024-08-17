const Garden = require("../model/gardenModel");
const maintainanceSchema = require("../model/maintainanceModel");
const userModel = require("../model/userModel");
module.exports.registerGarden = async (req, res) => {
  try {
    const {
      name,
      address,
      city,
      state,
      pincode,
      contact,
      height,
      width,
      plantDetails,
      waterSupplyMethod,
    } = req.body;
    console.log("FILE ", req.file);

    if (
      !name ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !contact ||
      !height ||
      !width ||
      !waterSupplyMethod
    ) {
      return res.status(404).json("Required Payload not found");
    }
    const newGarden = new Garden({
      name,
      address,
      city,
      state,
      pincode,
      contact,
      height,
      width,
      plantDetails,
      waterSupplyMethod,
      image: req.file.path,
      userId: req.user._id,
    });
    const saveGarden = await newGarden.save();
    return res.status(200).json(saveGarden);
  } catch (error) {
    console.log("registerGarden error", error);
    return res.status(500).json(error);
  }
};

module.exports.getGarden = async (req, res) => {
  try {
    const getGarden = await Garden.find({ userId: req.user._id });
    return res.status(200).json(getGarden);
  } catch (error) {
    console.log("getGarden error", error);
    return res.status(500).json(error);
  }
};

module.exports.updateGarden = async (req, res) => {
  try {
    const {
      _id,
      name,
      address,
      city,
      state,
      pincode,
      contact,
      height,
      width,
      plantDetails,
      waterSupplyMethod,
    } = req.body;
    const gardenDetail = await Garden.findOne({ _id });
    const updateGarden = await Garden.findOneAndUpdate(
      { _id },
      {
        name,
        address,
        city,
        state,
        pincode,
        contact,
        height,
        width,
        plantDetails,
        waterSupplyMethod,
        image: req.file ? req.file.path : gardenDetail.image,
      },
      { new: true }
    );
    return res.status(200).json(updateGarden);
  } catch (error) {
    console.log("updateGarden error", error);
    return res.status(500).json(error);
  }
};

module.exports.addMaintainance = async (req, res) => {
  try {
    const {
      userId,
      gardenId,
      maintenanceName,
      garden,
      potChange,
      waterSupply,
      designChange,
      description,
    } = req.body;
    const newMaintainance = new maintainanceSchema({
      userId,
      gardenId,
      maintenanceName,
      garden,
      potChange,
      waterSupply,
      designChange,
      description,
    });
    await newMaintainance.save();
    return res.status(200).json(newMaintainance);
  } catch (error) {
    console.log("addMaintainance error", error);
    return res.status(500).json(error);
  }
};

module.exports.getMaintainance = async (req, res) => {
  try {
    
    const gardenId = req?.params["id"] || null;
    let payload = { userId: req.user._id };
    if (gardenId) {
      payload.gardenId = gardenId;
    }

    const getMaintainance = await maintainanceSchema.find(payload);
    return res.status(200).json(getMaintainance);
  } catch (error) {
    console.log("getMaintainance error", error);
    return res.status(500).json(error);
  }
};

module.exports.getAllMaintainanceForAdmin = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res
        .status(403)
        .json({ message: "You don't have permission to access this route!" });
    const getMaintainance = await maintainanceSchema.find({}).populate({
      path: "gardenId",
      select: "",
    });
    return res.status(200).json(getMaintainance);
  } catch (error) {
    console.log("getMaintainance error", error);
    return res.status(500).json(error);
  }
};

module.exports.editMaintainanceForAdmin = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res
        .status(403)
        .json({ message: "You don't have permission to access this route!" });
    const getMaintainance = await maintainanceSchema.findByIdAndUpdate(
      { _id: req.params.id },
      req.body
    );
    return res
      .status(200)
      .json({
        getMaintainance,
        message: "Maintainance Updated successfully !",
      });
  } catch (error) {
    console.log("getMaintainance error", error);
    return res.status(500).json(error);
  }
};
