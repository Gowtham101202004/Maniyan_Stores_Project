const Product = require("../Models/productModel");
const expressAsyncHandler = require("express-async-handler");

const getProducts = expressAsyncHandler(async (req, res) => {
  try {
    const { category } = req.query; 

    const products = category
      ? await Product.find({ productCategory: category })
      : await Product.find();

    const types = category
      ? await Product.distinct("productType", { productCategory: category })
      : await Product.distinct("productType");

    const brands = category
      ? await Product.distinct("productBrand", { productCategory: category })
      : await Product.distinct("productBrand");

    res.status(200).json({
      products,
      types,
      brands,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
});

const createProduct = expressAsyncHandler(async (req, res) => {
  const { productImage, productCategory, productType, productBrand, productName, productUnit, productContainerType, productExpirationPeriod, productPrice, productPreviousPrice, productStock } = req.body;

  if (!productCategory || !productType || !productBrand || !productName || !productUnit || !productContainerType || !productExpirationPeriod || !productPrice || !productStock === undefined) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const product = await Product.create({
    productImage,
    productCategory,
    productType,
    productBrand,
    productName,
    productUnit,
    productContainerType,
    productExpirationPeriod,
    productPrice,
    productPreviousPrice,
    productStock,
  });

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400).json({ message: "Failed to create product" });
  }
});

const createManyProducts = expressAsyncHandler(async (req, res) => {
  const products = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    res.status(400).json({ message: "Invalid data. Expected a non-empty array of products." });
    return;
  }

  try {
    const createdProducts = await Product.insertMany(products);
    res.status(201).json({ message: "Products created successfully", products: createdProducts });
  } catch (err) {
    res.status(500).json({ message: "Error creating products", error: err.message });
  }
});

module.exports = { getProducts, createProduct, createManyProducts };
