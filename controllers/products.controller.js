const product = require("../modules/products.schema");
const HTTPMassage = require("../utils/httpMassage");
const meddlewareWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");

const getAllProdcuts = meddlewareWrapper(async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  const products = await product
    .find({}, { __v: false })
    .limit(limit)
    .skip(skip);
  res.json({ status: HTTPMassage.SUCCESS, data: { products: products } });
});

const addProduct = meddlewareWrapper(async (req, res, next) => {
  const body = req.body;
  Object.keys(body).forEach((key) => {
    if (!body[key]) {
      const err = appError.create(undefined, 400, HTTPMassage.FIAL, {
        key: `The ${key} is required`,
      });
      return next(err);
      // res.status(400).json({
      //   status: HTTPMassage.FIAL,
      //   data: { key: `The ${key} is required` },
      // });
    }
  });
  const newProduct = new product(req.body);
  await newProduct.save();
  const findcurrentProduct = await product.findById(
    { _id: newProduct["_id"] },
    { __v: false }
  );
  res
    .status(201)
    .json({ status: HTTPMassage.SUCCESS, data: findcurrentProduct });
  // try {
  // } catch (e) {
  //   res.status(400).json({
  //     status: HTTPMassage.ERROR,
  //     message: e.message,
  //   });
  // }
});

const getOneProduct = meddlewareWrapper(async (req, res, next) => {
  const getproduct = await product.findById(req.params.productId, {
    __v: false,
  });
  if (!getproduct) {
    const err = appError.create(undefined, 404, HTTPMassage.FIAL, null);
    // const err = new Error("product not found");
    // err.statuscode = 404;
    return next(err);
    // res.status(404).json({
    //   status: HTTPMassage.FIAL,
    //   data: null,
    // });
  }
  res.json({ status: HTTPMassage.SUCCESS, data: getproduct });
  // try {
  // } catch (e) {
  //   res.status(400).json({ status: HTTPMassage.ERROR, message: e.message });
  // }
});

const updateProduct = meddlewareWrapper(async (req, res) => {
  const data = await product.updateOne(
    { _id: req.params.productId },
    { $set: req.body }
  );
  if (!data) {
    const err = appError.create(undefined, 404, HTTPMassage.FIAL, null);
    return next(err);
    // res.json({
    //   status: HTTPMassage.FIAL,
    //   data: null,
    // });
  }
  res.json({ status: HTTPMassage.SUCCESS, data: data });
  // try {
  // } catch (e) {
  //   res.status(400).json({ status: HTTPMassage.ERROR, message: e.message });
  // }
});

const deleteProduct = meddlewareWrapper(async (req, res) => {
  const data = await product.deleteOne({ _id: req.params.productId });
  res.json({ status: HTTPMassage.SUCCESS, data: data });
  // try {
  // } catch (e) {
  //   res.state(400).json({ status: HTTPMassage.ERROR, message: e.message });
  // }
});

module.exports = {
  getAllProdcuts,
  addProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
};
