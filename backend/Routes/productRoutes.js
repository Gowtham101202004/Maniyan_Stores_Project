const express = require("express");
const { getProducts, createProduct, createManyProducts, updateStock } = require("../Controller/productController");

const Router = express.Router();

Router.get("/display-product-data", getProducts); 
Router.post("/insert-product-data", createProduct);
Router.post("/insertmany-product-data", createManyProducts);
Router.put("/update-stock/:productId", updateStock);

module.exports = Router;
