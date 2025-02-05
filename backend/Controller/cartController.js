const express = require("express");
const Cart = require("../Models/cartModel");

const addToCart = async (req, res) => {
  try {
    const { productName, productImage, productPrice, productUnit, userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const cartItem = new Cart({ productName, productImage, productPrice, productUnit, userId });
    await cartItem.save();
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart", error });
  }
};

const getCartItems = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send("User ID is required");
    
    const cartItems = await Cart.find({ userId });
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart data", error });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.findByIdAndDelete(id);
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item", error });
  }
};

module.exports = { addToCart, getCartItems, removeFromCart };
