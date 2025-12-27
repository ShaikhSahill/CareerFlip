const express = require("express");
const { register, login, googleAuthCallback,getUser } = require("../controller/user.controller");
const passport = require('passport');

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.get("/getuser",getUser)

// Google Auth Routes
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/auth/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/login" }),
    googleAuthCallback
);


module.exports = router;

