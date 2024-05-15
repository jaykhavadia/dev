const Garden = require("../model/gardenModel");
const maintainanceSchema = require("../model/maintainanceModel");
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
      userId,
    } = req.body;
    console.log("FILE ", req.file);
    const checkGardenIsRegistered = await Garden.findOne({ userId: userId });

    if (
      !name ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !contact ||
      !height ||
      !width ||
      !waterSupplyMethod ||
      !userId
    ) {
      return res.status(404).json("Required Payload not found");
    }
    if (checkGardenIsRegistered) {
      return res
        .status(403)
        .json({ message: "you have already registered a garden" });
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
      userId,
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
    const getGarden = await Garden.findOne({ userId: req.user._id });
    return res.status(200).json(getGarden);
  } catch (error) {
    console.log("getGarden error", error);
    return res.status(500).json(error);
  }
};

module.exports.updateGarden = async (req, res) => {
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
      userId,
    } = req.body;
    const gardenDetail = await Garden.findOne({ userId: req.user._id });
    const updateGarden = await Garden.findOneAndUpdate(
      { userId: req.user._id },
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
        userId,
        image: req.file ? req.file.path : gardenDetail.image,
      }
    );
    return res.status(200).json(updateGarden);
  } catch (error) {
    console.log("updateGarden error", error);
    return res.status(500).json(error);
  }
};


module.exports.addMaintainance = async (req, res) => {
  try {
    const { userId, gardenId, maintenanceName, garden, potChange, waterSupply, designChange, description } = req.body;
    const newMaintainance = new maintainanceSchema({
      userId,
      gardenId,
      maintenanceName,
      garden,
      potChange,
      waterSupply,
      designChange,
      description
    });
    await newMaintainance.save();
    return res.status(200).json(newMaintainance);
  } catch (error) {
    console.log("addMaintainance error", error);
    return res.status(500).json(error);
  }
}

module.exports.getMaintainance = async (req, res) => {
  try {
    const getMaintainance = await maintainanceSchema.find({ userId: req.user._id });
    return res.status(200).json(getMaintainance);
  } catch (error) {
    console.log("getMaintainance error", error);
    return res.status(500).json(error);
  }
}