const { check } = require("express-validator");

let validateRegisterUser = () => {
  return [
    check("username", "Username does not Empty").not().isEmpty(),
    // check("username", "username must be Alphanumeric").isAlphanumeric(),
    // check("user.username", "username more than 6 degits").isLength({ min: 6 }),
    check("email", "Email does not Empty").not().isEmpty(),
    check("email", "Invalid email").isEmail(),
    // check("user.birthday", "Invalid birthday").isISO8601("yyyy-mm-dd"),
    check("password", "Password more than 6 degits").isLength({ min: 6 }),
  ];
};

let validateLogin = () => {
  return [
    check("email", "Email does not Empty").not().isEmpty(),
    check("email", "Invalid email").isEmail(),
    check("password", "Password more than 6 degits").isLength({ min: 6 }),
  ];
};

let validateInput = () => {
  return [
    check("email", "Email does not Empty").not().isEmpty(),
    check("email", "Invalid email").isEmail(),
    check("fullName", "Please input your full name").not().isEmpty(),
    check("phoneNumber", "Please input your phone number")
      .isNumeric()
      .not()
      .isEmpty(),
    check("address", "Please input your address").not().isEmpty(),
  ];
};

let validate = {
  validateRegisterUser: validateRegisterUser,
  validateLogin: validateLogin,
  validateInput: validateInput,
};

module.exports = { validate };
