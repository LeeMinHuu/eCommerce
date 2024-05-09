const User = require("../models/user");
const Order = require("../models/order");
const Product = require("../models/product");

exports.getAllHistories = async (req, res, next) => {
  try {
    const histories = await Order.find({}).sort({ createdAt: -1 });
    console.log(histories);

    return res.status(200).send(histories);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 500, message: "Server Error" });
  }
};

exports.getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    console.log(products);

    return res.status(200).send(products);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 500, message: "Server Error" });
  }
};

exports.chat = async (req, res, next) => {
  try {
    return res.status(200).send({ status: 200, message: "Success" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 500, message: "Server Error" });
  }
};
