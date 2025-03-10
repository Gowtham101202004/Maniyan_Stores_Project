const express = require("express");
const { getOrders, createOrder } = require("../Controller/orderController");

const router = express.Router();

router.get("/get-orders", getOrders);
router.post("/create-order", createOrder);

module.exports = router;