const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    productImage: { type: String, required: false },
    productCategory: { type: String, required: true },
    productName: { type: String, required: true, unique: true  },
    productTitle: { type: String, required: true },
    productUnit: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productStock: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;