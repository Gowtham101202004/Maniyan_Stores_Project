const generateToken = require("../Config/generateToken");
const userModel = require("../Models/userModel");
const expressAsyncHandler = require("express-async-handler");

const loginController = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            address: user.address,
            phonenumber: user.phonenumber,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }
});

const registerController = expressAsyncHandler(async (req, res) => {
    const { name, email, password, address, phonenumber, image, isAdmin } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ message: "Name, email, and password are required" });
        return;
    }

    const userExist = await userModel.findOne({ email });
    if (userExist) {
        res.status(405).json({ message: "Email already exists !" });
        return;
    }

    const user = await userModel.create({
        name,
        email,
        password,
        image: image || "",
        address: address || "",
        phonenumber: phonenumber || null,
        isAdmin: isAdmin || false,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
            address: user.address,
            phonenumber: user.phonenumber,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: "Registration failed" });
    }
});

const googleLoginController = expressAsyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (!email || !name) {
        return res.status(400).json({ message: "Invalid data received from Google" });
    }

    let user = await userModel.findOne({ email });

    if (!user) {
        user = await userModel.create({
            name,
            email,
            isGoogleUser: true,
            image: "",
            address: "",
            phonenumber: null,
            isAdmin: false,
        });

        if (!user) {
            return res.status(400).json({ message: "Failed to create user with Google Sign-In" });
        }
    }

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        address: user.address,
        phonenumber: user.phonenumber,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
    });
});

const getUserDetailsController = expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;

    const user = await userModel.findById(userId).select("-password");

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

const updateUserController = expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const { name, image, address, phonenumber, isAdmin } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.image = image === "" ? "" : image;
    user.address = address !== undefined ? address : user.address;
    user.phonenumber = phonenumber !== undefined ? phonenumber : user.phonenumber;
    user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin;

    const updatedUser = await user.save();

    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        address: updatedUser.address,
        phonenumber: updatedUser.phonenumber,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
    });
});

const updateUserAddress = expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const { address } = req.body;
  
    try {
      const user = await userModel.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.address = address || user.address;
      const updatedUser = await user.save();
  
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.address,
        phonenumber: updatedUser.phonenumber,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      });
    } catch (error) {
      console.error("Error updating address:", error);
      res.status(500).json({ message: "Failed to update address" });
    }
  });

module.exports = {
    loginController,
    registerController,
    googleLoginController,
    getUserDetailsController,
    updateUserController,
    updateUserAddress
};