const express = require("express");
const quoteController = require("../controller/quoteController.js");
const route = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { auth } = require("../controller/authentication.js");

const uploadDir = path.join(__dirname, "../uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|PNG)$/)) {
    return cb(new Error("Please upload an image jpg|jpeg|png only"), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// route.post("/create", quoteController.createOneQuote);
route.get("/all", quoteController.getAllQuote);
route.post("/create",upload.single("image"),quoteController.createOneQuote
  );
module.exports = route;