const express = require("express");

const shopController = require("../controllers/shop");
const { validate } = require("../middleware/validator");
const router = express.Router();

const isAuth = require("../middleware/is-auth");

router.get("/carts", isAuth, shopController.getCart);

router.post("/carts/add", isAuth, shopController.postCart);

router.put("/carts/update", isAuth, shopController.putCart);

router.delete("/carts/delete", isAuth, shopController.deleteCart);

router.post(
  "/orders",
  isAuth,
  validate.validateInput(),
  shopController.postOrders
);

router.post("/email", isAuth, shopController.sendMail);

router.get("/histories", isAuth, shopController.getHistories);

router.get("/histories/:id", isAuth, shopController.getHistoriesDetail);

module.exports = router;
