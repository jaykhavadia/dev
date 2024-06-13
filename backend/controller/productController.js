const Product = require("../model/productModel");
module.exports.addProducts = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res
        .status(403)
        .json({ message: "You don't have permission to access this route!" });

    const { title, description, category, price } = req.body;
    console.log("FILE ", req.file);
    // const checkGardenIsRegistered = await Product.findOne({ userId: userId });

    if (!title || !description || !category || !price || !req.file) {
      return res.status(404).json("Required Payload not found");
    }

    const product = new Product({
      title,
      description,
      category,
      price,
      image: req.file.path,
    });

    const productDetails = await product.save();
    return res.status(200).json(productDetails);
  } catch (error) {
    console.log("registerGarden error", error);
    return res.status(500).json(error);
  }
};

module.exports.getAllProducts = async (req, res) => {
  try {
    const getProducts = await Product.find({}).populate("category", "name", "", "");
    return res.status(200).json(getProducts);
  } catch (error) {
    console.log("getProducts error", error);
    return res.status(500).json(error);
  }
};


module.exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const getProducts = await Product.findById(id).populate("category", "name", "", "");
    if(!getProducts) return res.status(404).json("Product not found");
    return res.status(200).json(getProducts);
  } catch (error) {
    console.log("getProducts error", error);
    return res.status(500).json(error);
  }
}

module.exports.updateProducts = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res
        .status(403)
        .json({ message: "You don't have permission to access this route!" });

    const { id } = req.params;
    const { title, description, category, price } = req.body;
    if (!title || !description || !category || !price) {
      return res.status(404).json("Required Payload not found");
    }
    let payload = {};
    if (!req.file) {
      payload = {
        title,
        description,
        category,
        price,
      }
    }
    else if (req.file) {
      payload = {
        title,
        description,
        category,
        price,
        image: req.file.path
      }
    }

    const updateProduct = await Product.findByIdAndUpdate(
      { _id: id }, payload,{new: true}
    );
    return res
      .status(200)
      .json({ updateProduct, message: "Product Updated successfully !" });
  } catch (error) {
    console.log("updateProducts error", error);
    return res.status(500).json(error);
  }
}