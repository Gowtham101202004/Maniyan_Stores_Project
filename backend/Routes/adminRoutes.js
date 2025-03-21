const express = require("express");
const router = express.Router();
const {
    countUsersAndProducts,
    allUsersData,
    updateUser,
    deleteUserById,
    allProductsData,
    updateProduct,
    deleteProductById,
    addProduct,
    getAllOrders,
    updateOrderStatus
} = require("../Controller/adminController");

router.get("/count", countUsersAndProducts);
router.get("/users", allUsersData);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUserById);

router.get("/products", allProductsData);
router.post("/add-products", addProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProductById);

router.get("/orders", getAllOrders);
router.put("/update-order", updateOrderStatus);

module.exports = router;