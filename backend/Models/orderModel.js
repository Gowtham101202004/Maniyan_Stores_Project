const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  productDetails: {
    type: Array,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  paymentDetails: {
    paymentId: {
      type: String,
      required: true,
    },
    payment_method_type: {
      type: Array,
      required: true,
    },
    payment_status: {
      type: String,
      required: true,
    },
  },
  shipping_options: {
    type: Array,
    default: [],
  },
  totalAmount: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;