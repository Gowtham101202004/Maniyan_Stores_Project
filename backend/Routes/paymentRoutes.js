const express = require('express');
const { createPaymentIntent } = require('../Controller/paymentController');
const router = express.Router();

router.post('/create-payment-intent', createPaymentIntent);

module.exports = router;
