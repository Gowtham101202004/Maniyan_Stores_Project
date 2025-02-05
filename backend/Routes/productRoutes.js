const express = require("express");
const { getProducts, createProduct, createManyProducts } = require("../Controller/productController");

const Router = express.Router();

Router.get("/display-product-data", getProducts); 
Router.post("/insert-product-data", createProduct);
Router.post("/insertmany-product-data", createManyProducts);

module.exports = Router;
