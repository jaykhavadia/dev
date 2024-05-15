// process.loadEnvFile();
require("dotenv").config();
const express = require("express");
const path = require("path");
const authentication = require("./routes/user.js");
const mongoose = require("mongoose");
const rolesRoutes = require("./routes/roles.js");
const cors = require("cors");
const morgan = require("morgan");
const gardenRoutes = require("./routes/garden.js");

// Create an Express application
const app = express();

const buildPath = path.join(__dirname, "..", "spa", "build");

app.use(express.static(buildPath));

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
app.use("/api/", authentication);
app.use("/api/roles", rolesRoutes);
app.use("/api/garden", gardenRoutes);

app.get("*", (req, res) => {
  console.log("Route :->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ", req.url);
  res.sendFile(path.join(buildPath, "index.html"));
});

// Start the server on port 3000
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
