const Category = require("../model/categoryModel");
module.exports.addCategory = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res
        .status(403)
        .json({ message: "You don't have permission to access this route!" });

    if (!req.body.name) {
      return res.status(404).json("Required Payload not found");
    }

    const category = new Category({
       name: req.body.name 
    });

    const categoryDetail = await category.save();
    return res.status(200).json(categoryDetail);
  } catch (error) {
    console.log("addCategory error", error);
    return res.status(500).json(error);
  }
};

module.exports.getAllCategories = async (req, res) => {
  try {
    const allCategory = await Category.find({});
    return res.status(200).json(allCategory);
  } catch (error) {
    console.log("getAllCategory error", error);
    return res.status(500).json(error);
  }
};
