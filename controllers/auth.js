const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validationResult } = require("express-validator");

// const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

exports.getAllUsers = async (req, res, next) => {
  try {
    const user = await User.find({});

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 500, message: "Server Error" });
  }
};

exports.getUserDetail = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);

    return res.status(200).json({
      email: user.email,
      username: user.username,
      fullname: user.fullName,
      phonenumber: user.phoneNumber,
      role: user.role,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 500, message: "Server Error" });
  }
};

exports.getAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId);

    return res.status(200).json({
      email: user.email,
      username: user.username,
      fullname: user.fullName,
      phonenumber: user.phoneNumber,
      role: user.role,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 500, message: "Server Error" });
  }
};

// BEGIN AUTH FUNC
// Signup API
exports.postSignup = async (req, res, next) => {
  const { username, password, fullname, phonenumber, email, isAdmin } =
    req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 422, message: errors.array() });
  }

  try {
    let user = await User.findOne({ email });
    let usernameFind = await User.findOne({ username });
    if (user) {
      return res.status(400).send("Email already exists");
    }
    if (usernameFind) {
      return res.status(400).send("Username already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      password: hashedPassword,
      fullName: fullname,
      phoneNumber: phonenumber,
      email,
      isAdmin,
    });

    await user.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: 500, message: "Server Error" });
  }
};

// Login API
exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 422, message: errors.array() });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ status: 400, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .send({ status: 400, message: "Invalid credentials" });
    }

    if (user && isMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.userId = user._id;
      // res.cookie("userId", user._id, { signed: true, httpOnly: true });

      return res.status(200).send({
        status: 200,
        message: "Login successfully!",
        userId: user._id,
        email: user.email,
        username: user.username,
        fullname: user.fullName,
        phonenumber: user.phoneNumber,
        role: user.role,
      });
    }
  } catch (error) {
    res.status(500).send({ status: 500, message: "Server Error" });
  }
};

// Logout API
exports.getLogout = (req, res, next) => {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res
          .status(200)
          .clearCookie("connect.sid", {
            path: "/",
          })
          .send("Logged out successfully");
      }
    });
  }
};
