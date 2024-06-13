const Address = require("../model/addressModel");

module.exports.createAddress = async (req, res) => {
  try {
    const { name, city, state, pincode, contact, address_1, address_2, landMark } = req.body;
    const userId = req.user._id;
    if (!name  || !city || !state || !pincode || !contact || !address_1 || !address_2 || !landMark) {
      return res.status(404).json({message:"Required Payload not found"});
    }
    const addressDetail = new Address({
      name,
      city,
      state,
      pincode,
      contact,
      userId,
      address_1,
      address_2,
      landMark
    });
    const saveAddress = await addressDetail.save();
    return res.status(200).json({message:"Address Created Successfully",saveAddress});
  } catch (error) {
    console.log("createAddress error", error);
    return res.status(500).json(error);
  }
};

module.exports.updateAddress = async (req, res) => {
  try {
    const { name, city, state, pincode, contact, address_1, address_2, landMark } = req.body;
    const userId  = req.user._id;
    if (!name  || !city || !state || !pincode || !contact || !address_1 || !address_2 || !landMark) {
      return res.status.status(404).json({message:"Required Payload not found"});
    }
    const updateAddress = await Address.findOneAndUpdate(
        {userId} ,
      {
        name,
        city,
        state,
        pincode,
        contact,
        userId,
        address_1,
        address_2,
        landMark
      },
      { new: true }
    );
    return res.status(200).json({
      message: "Address Updated Successfully!",
      updateAddress
    });
  } catch (error) {
    console.log("updateAddress error", error);
    return res.status(500).json(error);
  }
};

module.exports.getAddressByUserId = async (req, res) => {
  try {
    const userId = req.user._id;
    const address = await Address.findOne({ userId: userId });
    return res.status(200).json({message:'Address Fetched successfully !',address});
  } catch (error) {
    console.log("getAddress error", error);
    return res.status(500).json(error);
  }
};
