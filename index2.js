const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;
require("dotenv").config();
const cors = require("cors");
const config = require("./configuration/config");
// const mainRoute = require("./routes");

let mainRoute;
try {
  mainRoute = require("./routes");
} catch (err) {
  process.exit(1);
}

mongoose
  .connect(config.mongoURL, {})
  .then(async () => {
    console.log("Connected To MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Couldn't Connect To MongoDB", error);
    process.exit(1);
  });

// Middleware
app.use(express.json());

app.use(cors());
// app.options("*", cors());

app.use("/kanbanBoard", mainRoute);
