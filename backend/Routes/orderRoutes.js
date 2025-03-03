const express = require("express");
const { getOrders } = require("../Controller/orderController");

const router = express.Router();

router.get("/get-orders", getOrders);

module.exports = router;