const express = require("express");

const bcrypt = require("bcrypt");
const authController = require("../controllers/auth");
const { validate } = require("../middleware/validator");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/users", isAuth, authController.getAllUsers);

router.get("/users/:id", isAuth, authController.getUserDetail);

router.get("/auth", isAuth, authController.getAuth);

router.post(
  "/signup",
  validate.validateRegisterUser(),
  authController.postSignup
);

// router.get("/signup", authController);

router.post("/login", validate.validateLogin(), authController.postLogin);

router.get("/logout", authController.getLogout);

module.exports = router;
