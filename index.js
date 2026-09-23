const Express = require("express");
require("dotenv").config();
const config = require("./configuration/config");
const app = new Express();
const cors = require("cors");
const mongoose = require("mongoose");
const mainRoute = require("./routes");

// MongoDB Connection
mongoose
  .connect(config.mongoURL, {})
  .then(async () => {
    console.log("Connected To MongoDB");
  })
  .catch((err) => console.log("Couldn't connect to MongoDB:", err));

//   Middleware
app.use(cors());
app.options("/", cors());

// IMPORTANT
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

// CORS & Security Headers
app.all("/", function (req, res, next) {
  res.header("X-Content-Type-Options", "nosniff");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,OPTIONS,PUT,PATCH,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type,Accept,Authorization"
  );
  if ("OPTIONS" == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Additional CORS Handling
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use((req, res, next) => {
  console.log("method: ", req.method, "url: ", req.url);
  next();
});

// app.use("/api/kanbanBoard", mainRoute);
app.use("/api/kanbanBoard", mainRoute);

app.get("/", (req, res) => {
  res.json({ message: "Backend is running..." });
});
// Start The Server
app.listen(process.env.PORT, (error) => {
  if (!error) {
    console.log(`Server is running on port: ${process.env.PORT}!`);
  }
});
