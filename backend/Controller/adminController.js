const expressAsyncHandler = require("express-async-handler");
const userModel = require("../Models/userModel");
const Product = require("../Models/productModel");
const Order = require("../Models/orderModel");

const countUsersAndProducts = expressAsyncHandler(async (req, res) => {
    try {
        const userCount = await userModel.countDocuments();
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();
        const revenueResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ]);
        const revenueCount = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
        return res.status(200).json({ message: "Count fetched!", data: { userCount, productCount, orderCount, revenueCount } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const allUsersData = expressAsyncHandler(async (req, res) => {
    try {
        const users = await userModel.find().select("-password");
        return res.status(200).json({ message: "User data fetched!", data: users });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const updateUser = expressAsyncHandler(async (req, res) => {
    const { name, email, isAdmin, address, phonenumber, image } = req.body;

    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin;
        user.address = address || user.address;
        user.phonenumber = phonenumber || user.phonenumber;
        user.image = image === "" ? "" : image;

        await user.save();
        res.status(200).json({ message: `User ${user.name}'s data updated!` });
    } catch (err) {
        res.status(500).json({ message: "Server error, please try again later." });
    }
});

const deleteUserById = expressAsyncHandler(async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User deleted!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const allProductsData = expressAsyncHandler(async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({ message: "Product data fetched!", data: products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const addProduct = expressAsyncHandler(async (req, res) => {
    const { 
        productImage, 
        productCategory, 
        productType, 
        productBrand, 
        productName, 
        productUnit, 
        productContainerType, 
        productExpirationPeriod, 
        productPrice, 
        productPreviousPrice, 
        productStock 
    } = req.body;

    try {
        const newProduct = new Product({
            productImage,
            productCategory,
            productType,
            productBrand,
            productName,
            productUnit,
            productContainerType,
            productExpirationPeriod,
            productPrice,
            productPreviousPrice,
            productStock
        });

        await newProduct.save();
        res.status(201).json({ message: "Product added successfully!", data: newProduct });
    } catch (err) {
        res.status(500).json({ message: "Server error, please try again later." });
    }
});

const updateProduct = expressAsyncHandler(async (req, res) => {
    const { productImage, productCategory, productType, productBrand, productName, productUnit, productContainerType, productExpirationPeriod, productPrice, productPreviousPrice, productStock } = req.body;

    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.productImage = productImage;
        product.productCategory = productCategory;
        product.productType = productType;
        product.productBrand = productBrand;
        product.productName = productName;
        product.productUnit = productUnit;
        product.productContainerType = productContainerType;
        product.productExpirationPeriod = productExpirationPeriod;
        product.productPrice = productPrice;
        product.productPreviousPrice = productPreviousPrice;
        product.productStock = productStock;

        await product.save();
        res.status(200).json({ message: `Product ${product.productName} updated!` });
    } catch (err) {
        res.status(500).json({ message: "Server error, please try again later." });
    }
});

const deleteProductById = expressAsyncHandler(async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "Product deleted!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const getAllOrders = expressAsyncHandler(async (req, res) => {
    try {
        const orders = await Order.find();
        return res.status(200).json({ message: "Orders fetched successfully!", data: orders });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const updateOrderStatus = expressAsyncHandler(async (req, res) => {
    const { orderId, orderStatus, deliveryDate } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.orderStatus = orderStatus || order.orderStatus;

        if (deliveryDate) {
            order.deliveryDate = new Date(deliveryDate); 
        } else if (orderStatus === "Shipped" || orderStatus === "Arrived") {
            const newDeliveryDate = new Date();
            newDeliveryDate.setDate(newDeliveryDate.getDate() + 3);
            order.deliveryDate = newDeliveryDate;
        }

        await order.save();
        return res.status(200).json({ message: "Order status updated!", data: order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = {
    countUsersAndProducts,
    allUsersData,
    updateUser,
    deleteUserById,
    allProductsData,
    addProduct,
    updateProduct,
    deleteProductById,
    getAllOrders,
    updateOrderStatus
};