const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    productImage: { type: String, required: false },
    productCategory: { type: String, required: true },
    productType: { type: String, required: true },
    productBrand: { type: String, required: true },
    productName: { type: String, required: true, unique: true  },
    productUnit: { type: String, required: true },
    productContainerType: { type: String, required: true },
    productExpirationPeriod: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productPreviousPrice: { type: Number },
    productStock: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;