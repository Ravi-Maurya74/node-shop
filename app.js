const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

// Connect to MongoDB

// START: MONGOOSE_CONNECT
mongoose.connect(
  "mongodb+srv://" +
    process.env.MONGO_ATLAS_USER +
    ":" +
    encodeURIComponent(process.env.MONGO_ATLAS_PW) +
    "@node-shop.celgwu4.mongodb.net/?retryWrites=true&w=majority"
);

// END: MONGOOSE_CONNECT

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads")); // Make the uploads folder publicly available
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS handling

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow any origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization" // Allow these headers
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET"); // Allow these methods
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// Error handling

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 400;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
