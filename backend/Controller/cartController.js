const express = require("express");
const Cart = require("../Models/cartModel");

const addToCart = async (req, res) => {
  try {
    const { userId, products } = req.body;
    if (!userId || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "User ID and products are required" });
    }

    // Check for existing cart or create a new one
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products });
    } else {
      products.forEach(newProduct => {
        const existingProductIndex = cart.products.findIndex(
          item => item.product.toString() === newProduct.product
        );
        if (existingProductIndex > -1) {
          cart.products[existingProductIndex].quantity += newProduct.quantity || 1;
        } else {
          cart.products.push(newProduct);
        }
      });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart", error });
  }
};

const getCartItems = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).send("User ID is required");

    const cartItems = await Cart.findOne({ userId }).populate("products.product");
    res.status(200).json(cartItems ? cartItems.products : []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart data", error });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(
      item => item.product.toString() !== productId
    );
    await cart.save();

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove item", error });
  }
};

module.exports = { addToCart, getCartItems, removeFromCart };