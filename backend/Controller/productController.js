const Product = require("../Models/productModel");
const expressAsyncHandler = require("express-async-handler");

// Get all products
const getProducts = expressAsyncHandler(async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

// Create a product
const createProduct = expressAsyncHandler(async (req, res) => {
  const { productImage, productCategory, productName, productTitle, productUnit, productPrice, productStock } = req.body;

  if (!productName || !productTitle || !productCategory || !productUnit || !productPrice || productStock === undefined) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const product = await Product.create({
    productImage,
    productCategory,
    productName,
    productTitle,
    productUnit,
    productPrice,
    productStock,
  });

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400).json({ message: "Failed to create product" });
  }
});

module.exports = { getProducts, createProduct };