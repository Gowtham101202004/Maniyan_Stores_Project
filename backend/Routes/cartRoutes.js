const express = require("express");
const { addToCart, getCartItems, removeFromCart } = require("../Controller/cartController");
const router = express.Router();

router.post("/add", addToCart);
router.get("/", getCartItems);
router.delete("/remove/:id", removeFromCart);

module.exports = router;
