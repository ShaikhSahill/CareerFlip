const jwt = require("jsonwebtoken");
const {
    verifyToken,
    userModel
} = require("../models/user.model");

const authMiddleware = async (req, res, next) => {

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const decoded = await verifyToken(token);
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }


}

module.exports = { authMiddleware };