const express = require("express");
const {
    loginController,
    registerController,
    googleLoginController
  } = require("../Controller/userController");

const Router = express.Router();

Router.post("/login", loginController);
Router.post("/register", registerController);
Router.post("/google-login", googleLoginController);

module.exports = Router;