const express = require("express");

const productController = require("../controllers/product");
const { validate } = require("../middleware/validator");

const router = express.Router();

router.get("/products", productController.getProducts);

router.get("/products/category", productController.getCategory);

router.get("/products/pagination", productController.getCategoryPagination);

router.get("/products/:id", productController.getProductDetail);

module.exports = router;
