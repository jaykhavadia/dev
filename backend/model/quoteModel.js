const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    serviceType: {
      type: [String],
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: false,
    },
    photo: {
      type: String,
      required: false,
    }
  })

module.exports = mongoose.model("Quote", quoteSchema)