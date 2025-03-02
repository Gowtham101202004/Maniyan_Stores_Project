const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./Routes/userRoutes');
const productRoutes = require('./Routes/productRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const cartRoutes = require('./Routes/cartRoutes');
const adminRoutes = require('./Routes/adminRoutes');

const app = express();

app.use(cors({ origin: "*" }));

app.use((req, res, next) => {
    if (req.originalUrl === "/payment/webhook") {
        next();
    } else {
        express.json()(req, res, next);
    }
});

const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGO_URI;
        if (!mongoUrl) {
            throw new Error('MONGO_URI is not defined in environmental variables');
        }
        await mongoose.connect(mongoUrl);
        console.log('Database Connected...');
    } catch (err) {
        console.log('Database Connection Error ->', err);
    }
};

connectDB();

app.get("/", (req, res) => {
    res.send("API is running");
});

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/payment", orderRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});