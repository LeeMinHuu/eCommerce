const express = require("express");
const adminController = require("../controllers/admin");
const { validate } = require("../middleware/validator");
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");
const isAdvisor = require("../middleware/is-advisor");

const router = express.Router();

router.get("/all-histories", isAdvisor, adminController.getAllHistories);

router.get("/all-products", isAdmin, adminController.getAllProduct);

router.get("/chatrooms/getAllRoom", isAdvisor, adminController.chat);

module.exports = router;
