const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, 
  },
  productName: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productUnit: {
    type: String,
    required: true,
  }
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
