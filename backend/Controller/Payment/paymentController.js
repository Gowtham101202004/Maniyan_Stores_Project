const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const userModel = require('../../Models/userModel');

const paymentController = async (req, res) => {
  try {
    const { cartItems, email } = req.body;

    if (!cartItems || !email) {
      return res.status(400).json({ message: "Missing cartItems or email" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name, 
          images: item.images, 
          metadata : {
              productId : item._id,
          },
        },
        unit_amount: Math.round(item.price * 100), 
      },
      quantity: item.quantity,
      adjustable_quantity: {
        enabled: true,
        minimum: 1,
        maximum: 10, 
      },
    }));

    console.log("Creating Stripe session with lineItems:", lineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:5173/success', 
      cancel_url: 'http://localhost:5173/cancel', 
      customer_email: user.email, 
      shipping_options: [{ shipping_rate: 'shr_1QxTpj4UOuOwfYxghjdIwZcb' }],
      metadata : {
        userId : String(user._id),
      }
    });

    console.log("Stripe session created successfully:", session);

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error in paymentController:", error);
    res.status(500).json({
      message: error?.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

module.exports = { paymentController };