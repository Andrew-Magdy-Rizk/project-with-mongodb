const express = require("express");
const productsController = require("../controllers/products.controller");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();
const allowedTo = require("../middlewares/allowedTo");
router
  .route("/")
  .get(productsController.getAllProdcuts)
  .post(productsController.addProduct);

router
  .route("/:productId")
  .get(productsController.getOneProduct)
  .patch(productsController.updateProduct)
  .delete(
    verifyToken,
    allowedTo("ADMIN", "SUPER_ADMIN"),
    productsController.deleteProduct
  );

module.exports = router;
