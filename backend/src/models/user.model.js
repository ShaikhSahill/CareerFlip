const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    googleId: {
        type: String
    },
    googleAccessToken: {
        type: String
    },
    googleRefreshToken: {
        type: String
    }
});



//Google Oauth Model






//auth methods

const generateToken = function (id) {
    return jwt.sign({ id: id }, process.env.JWT_SECRET);
};

const verifyToken = function (token) {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const hashPassword = function (password) {
    return bcrypt.hashSync(password, 10);
};

const comparePassword = async function (password, userPassword) {
    return await bcrypt.compare(password, userPassword);
};









const userModel = mongoose.model("User", userSchema);

module.exports = {
    generateToken,
    verifyToken,
    hashPassword,
    comparePassword,
    userModel
};
