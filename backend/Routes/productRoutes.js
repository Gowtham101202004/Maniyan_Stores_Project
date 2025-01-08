const express = require("express");
const { getProducts, createProduct } = require("../Controller/productController");

const Router = express.Router();

Router.get("/", getProducts); 
Router.post("/", createProduct);

module.exports = Router;
