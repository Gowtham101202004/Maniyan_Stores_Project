const express = require("express");
const { paymentController } = require("../Controller/Payment/paymentController");
const router = express.Router();

router.post("/checkout", paymentController);

module.exports = router;