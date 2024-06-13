const mongoose = require("mongoose");

const maintainanceSchema = new mongoose.Schema(
  {
    maintenanceName: {
      type: String,
      required: true,
    },
    garden: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gardenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Garden",
      required: true,
    },
    potChange: {
      type: Boolean,
      required: true,
    },
    waterSupply: {
      type: Boolean,
      required: true,
    },
    designChange: {
      type: Boolean,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: false,
      default: "pending",
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Maintainance", maintainanceSchema)