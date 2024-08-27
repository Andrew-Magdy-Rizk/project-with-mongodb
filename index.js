require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productsRouter = require("./router/products.router");
const usersRouter = require("./router/users.router");
const HTTPMassage = require("./utils/httpMassage");
const path = require("node:path");
const url = process.env.MONGO_URL;
const port = process.env.PORT || 4000;
const app = express();

mongoose.connect(url).then(() => {
  console.log("connected to MongoDB");
});

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/products", productsRouter);

app.use("/api/users", usersRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: HTTPMassage.ERROR,
    message: "server is not found",
  });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 400).json({
    status: err.statusText || HTTPMassage.ERROR,
    message: err.message,
    code: err.statusCode || 400,
    data: err.data,
  });
});
