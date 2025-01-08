const generateToken = require("../Config/generateToken");
const userModel = require("../Models/userModel");
const expressAsyncHandler = require("express-async-handler");

const loginController = expressAsyncHandler(async(req, res)=>{
    const {email, password} = req.body;

    const user = await userModel.findOne({email});

    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            email: user.email,
            token: generateToken(user._id),
        })
    } else{
        res.status(401).json({ message: "Invalid username or password" });
    }
}); 

const registerController = expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      res.status(400).json({ message: "All input fields are required" });
      return;
    }
  
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      res.status(405).json({ message: "Email already exists !" });
      return;
    }
  
    const userNameExist = await userModel.findOne({ name });
    if (userNameExist) {
      res.status(406).json({ message: "Username already taken !" });
      return;
    }

    const user = await userModel.create({ name, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
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
      });

      if (!user) {
          return res.status(400).json({ message: "Failed to create user with Google Sign-In" });
      }
  }

  res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
  });
});

module.exports = {
    loginController,
    registerController,
    googleLoginController,
};