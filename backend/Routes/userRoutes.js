const express = require("express");
const {
    loginController,
    registerController,
    googleLoginController,
    getUserDetailsController,
    updateUserController,
} = require("../Controller/userController");

const Router = express.Router();

Router.post("/login", loginController);
Router.post("/register", registerController);
Router.post("/google-login", googleLoginController);
Router.get("/get-user/:id", getUserDetailsController);  
Router.put("/update-user/:id", updateUserController);  

module.exports = Router;