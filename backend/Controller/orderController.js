const Order = require("../Models/orderModel");

const getOrders = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) return res.status(400).json({ message: "User ID is required" });

    let orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    orders = await Promise.all(
      orders.map(async (order) => {
        if (!order.deliveryDate) {
          const deliveryDate = new Date(order.createdAt);
          deliveryDate.setDate(deliveryDate.getDate() + 3);
          order.deliveryDate = deliveryDate;
          await order.save();
        }
        return order;
      })
    );

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

module.exports = { getOrders };