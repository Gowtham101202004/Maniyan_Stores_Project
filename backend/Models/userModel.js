const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: function () {
                return !this.isGoogleUser;
            },
        },
        isGoogleUser: {
            type: Boolean,
            default: false,
        },
        phonenumber: {
            type: Number, 
            default: null,
        },
        address: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

userModel.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userModel.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("users", userModel);
module.exports = User;
