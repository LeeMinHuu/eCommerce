const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});

    return res.status(200).json({
      status: 200,
      results: products,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.getProductDetail = async (req, res, next) => {
  const productId = req.params.id;
  //   console.log(productId);
  try {
    const product = await Product.findById(productId);
    return res.status(200).json({
      status: 200,
      results: product,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.getCategory = async (req, res, next) => {
  const category = req.query.category;
  try {
    const productsByCategory = await Product.find({ category: category });
    return res.status(200).json({
      status: 200,
      results: productsByCategory,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

exports.getCategoryPagination = async (req, res, next) => {
  const category = req.query.category;
  const count = req.query.count;
  const page = req.query.page || 1;

  try {
    const productsByCategory = await Product.find({ category: category })
      .skip(count * page - count)
      .limit(count);
    return res.status(200).json({
      status: 200,
      results: productsByCategory,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
