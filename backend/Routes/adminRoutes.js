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
} = require("../Controller/adminController");

// Admin routes
router.get("/count", countUsersAndProducts);
router.get("/users", allUsersData);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUserById);

router.get("/products", allProductsData);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProductById);

module.exports = router;
