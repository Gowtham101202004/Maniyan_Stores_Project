const express = require("express");
const { paymentController } = require("../Controller/Payment/paymentController");
const { webhooks } = require("../Controller/Payment/webhooks");

const router = express.Router();

router.post("/webhook", express.raw({ type: 'application/json' }), webhooks);
router.post("/checkout", paymentController);

module.exports = router;