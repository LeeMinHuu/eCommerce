const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const Cart = require("../models/cart");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
require("dotenv").config();

var transport = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

const MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "eShop",
    link: "https://leeminhuu.com/",
  },
});

var email = {};

function convertMoney(money) {
  const str = money + "";
  let output = "";

  let count = 0;
  for (let i = str.length - 1; i >= 0; i--) {
    count++;
    output = str[i] + output;

    if (count % 3 === 0 && i !== 0) {
      output = "." + output;
      count = 0;
    }
  }

  return output;
}

exports.getCart = async (req, res, next) => {
  const user = req.session.user._id;
  try {
    const cart = await Cart.findOne({ user });

    if (cart && cart.items.length > 0) {
      return res.status(200).send(cart);
    } else {
      return res.send([]);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 500, message: "Server Error" });
  }
};

exports.postCart = async (req, res, next) => {
  const user = req.session.user._id;
  //   const { itemId, quantity } = req.body;
  const productId = req.query.idProduct;
  const quantity = Number(req.query.count);
  try {
    const cart = await Cart.findOne({ user });
    const item = await Product.findOne({ _id: productId });

    if (!item) {
      res.status(404).send({ status: 400, message: "Item not found" });
      return;
    }

    const price = item.price;
    const name = item.name;
    const img = item.img1;

    //If cart already exists for user,
    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId == productId
      );
      //check if product exists or not
      if (itemIndex > -1) {
        let product = cart.items[itemIndex];
        product.quantity += quantity;
        cart.bill = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);
        cart.items[itemIndex] = product;
        await cart.save();
        return res.status(200).send(cart);
      } else {
        cart.items.push({ productId, name, img, quantity, price });
        cart.bill = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);
        await cart.save();
        return res.status(200).send(cart);
      }
    } else {
      //no cart exists, create one
      const newCart = await Cart.create({
        user,
        items: [{ productId, name, img, quantity, price }],
        bill: quantity * price,
      });
      return res.status(201).send(newCart);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("something went wrong");
  }
};

exports.putCart = async (req, res, next) => {
  const user = req.session.user._id;
  const productId = req.query.idProduct;
  const quantity = Number(req.query.count);

  try {
    const cart = await Cart.findOne({ user });
    const item = await Product.findOne({ _id: productId });

    if (!item) {
      res.status(404).send({ status: 404, message: "Item not found" });
      return;
    }

    const price = item.price;
    const name = item.name;
    const img = item.img1;

    //If cart already exists for user,
    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId == productId
      );

      //check if product exists or not
      if (itemIndex > -1) {
        let product = cart.items[itemIndex];
        product.quantity = quantity;
        cart.bill = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);
        cart.items[itemIndex] = product;
        await cart.save();
        return res.status(200).send(cart);
      } else {
        cart.items.push({ productId, name, img, quantity, price });
        cart.bill = cart.items.reduce((acc, curr) => {
          return acc + curr.quantity * curr.price;
        }, 0);
        await cart.save();
        return res.status(200).send(cart);
      }
    } else {
      //no cart exists, create one
      const newCart = await Cart.create({
        user,
        items: [{ productId, name, img, quantity, price }],
        bill: quantity * price,
      });
      return res.status(201).send(newCart);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 500, message: "Server Error" });
  }
};

exports.deleteCart = async (req, res, next) => {
  const user = req.session.user._id;
  const productId = req.query.idProduct;
  try {
    let cart = await Cart.findOne({ user });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId == productId
    );

    if (itemIndex > -1) {
      let item = cart.items[itemIndex];
      cart.bill -= item.quantity * item.price;
      if (cart.bill < 0) {
        cart.bill = 0;
      }
      cart.items.splice(itemIndex, 1);
      cart.bill = cart.items.reduce((acc, curr) => {
        return acc + curr.quantity * curr.price;
      }, 0);
      cart = await cart.save();

      return res.status(200).send(cart);
    } else {
      return res.status(404).send("Item not found");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: 500, message: "Server Error" });
  }
};

exports.postOrders = async (req, res, next) => {
  const user = req.session.user._id;
  const {
    items,
    bill,
    fullName,
    email,
    phoneNumber,
    address,
    status,
    delivery,
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 422, message: errors.array() });
  }

  try {
    const order = await new Order({
      user,
      items,
      bill,
      fullName,
      email,
      phoneNumber,
      address,
      status,
      delivery,
    });

    await order.save();

    res.status(201).send({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error make order!" });
  }
};

exports.getHistories = async (req, res, next) => {
  const user = req.session.user._id;
  try {
    const histories = await Order.find({ user });
    console.log(histories);

    return res.status(200).send(histories);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: "Server Error!" });
  }
};

exports.getHistoriesDetail = async (req, res, next) => {
  const orderId = req.params.id;

  try {
    const histories = await Order.findById(orderId);
    console.log(histories);

    return res.status(200).send(histories);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: "Server Error!" });
  }
};

exports.sendMail = async (req, res, next) => {
  const { to, fullName, phoneNumber, address, userId } = req.body;
  console.log(to, fullName, phoneNumber, address, userId);

  try {
    const order = await Order.findOne({ user: userId }).sort({ createdAt: -1 });
    console.log(order);

    // body of the email
    email = {
      body: {
        greeting: "Kính gửi",
        signature: "Chúc quý khách 1 ngày vui vẻ",
        dictionary: {
          "Ngày đặt hàng": order.createdAt.toLocaleDateString("en-GB"),
          "Địa chỉ": order.address,
          "Số điện thoại": order.phoneNumber,
          Tổng: convertMoney(order.bill),
        },
        title: "Đặt hàng thành công!",
        name: order.fullName,
        intro: ["Bạn đã đặt hàng thành công.", "Chi tiết đơn hàng:"],
        table: {
          data: order.items.map((ele) => {
            return {
              "Sản phẩm": ele.name,
              "Số lượng": ele.quantity,
              "Đơn giá": convertMoney(ele.price),
              "Thành tiền": convertMoney(ele.price * ele.quantity),
            };
          }),
          // {
          //   item: "Node.js",
          //   description:
          //     "Event-driven I/O server-side JavaScript environment based on V8.",
          //   price: "$10.99",
          // },
          // {
          //   item: "Mailgen",
          //   description:
          //     "Programmatically create beautiful e-mails using plain old JavaScript.",
          //   price: "$1.99",
          // },
          columns: {
            // Optionally, customize the column widths
            customWidth: {
              "Sản phẩm": "50%",
              "Đơn giá": "20%",
              "Thành tiền": "20%",
            },
            // Optionally, change column text alignment
            customAlignment: {
              totalPrice: "right",
            },
          },
        },
        action: {
          instructions:
            "Bạn có thể kiểm tra thêm về thông tin đơn hàng tại đây:",
          button: {
            color: "#3869D4",
            text: "Kiểm tra đơn hàng",
            link: "http://localhost:3000/history/" + order._id,
          },
        },
        outro: "Cảm ơn bạn đã đặt hàng.",
      },
    };

    const emailBody = MailGenerator.generate(email);
    // send mail with defined transport object
    const mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: "Đặt hàng thành công!",
      html: emailBody,
    };

    const mailSent = transport.sendMail(mailOptions);
    console.log("Email sent: " + mailSent.messageId);
    res.send("Email sent successfully");

    // transport.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.log(error);
    //     res.status(500).send("Error sending email");
    //   } else {
    //     console.log("Email sent: " + info.response);
    //     res.send("Email sent successfully");
    //   }
    // });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error sending email");
  }
};

// exports.postOrders = async (req, res, next) => {
//   const { userId } = req.body;
//   try {
//     const findTransaction = await Transaction.find({ user: userId }).populate({
//       path: "hotel",
//       select: "name",
//     });

//     return res.status(200).json({
//       status: 200,
//       results: findTransaction,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error find transaction", error });
//   }
// };
