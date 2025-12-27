const {
    generateToken,
    verifyToken,
    hashPassword,
    comparePassword,
    userModel
} = require("../models/user.model");
const jwt = require("jsonwebtoken");



const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const alreadyUser = await userModel.findOne({ email });
        if (alreadyUser) {
            return res.status(400).json({ error: "User already exists" });
        }


        const hashedPassword = hashPassword(password);
        const user = await userModel.create({ username, email, password: hashedPassword });


        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatchpassword = await comparePassword(password, user.password);  //(loginPassword, storedHash);
        console.log(isMatchpassword);
        if (!isMatchpassword) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = generateToken(user._id);
        res.cookie("token", token);
        console.log(await verifyToken(token));
        res.json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const googleAuthCallback = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Authentication failed" });
        }
        console.log(req.user);

        const token = generateToken(req.user._id);

        // Set cookie
        res.status(201).cookie("token", token);

        // Redirect to frontend dashboard with token
        res.redirect(`http://localhost:5173/dashboard`);

    } catch (error) {
        res.status(500).redirect('http://localhost:5173/login?error=AuthFailed');
    }
};



const getUser = async (req, res) => {
    try {
        const token = req.cookies.token;
        const user = await verifyToken(token);
        const { username } = await userModel.findById(user.id);
        res.json({ username });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    googleAuthCallback,
    register,
    login,
    getUser
};
