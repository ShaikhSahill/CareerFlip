const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const userRoute = require("./routes/user.route");
const morgan = require("morgan");
const passport = require("passport");
require('./config/passport'); // Import passport config
const careerSwapRoute = require("./routes/careerSwap.route");
const roadmapRoute = require("./routes/roadmap.routes");
const microlearningRoute = require("../src/routes/microlearning.route");

console.log("Mounting routes...");

app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://career-flip.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(morgan("dev"));


app.use("/api/user", userRoute);
app.use("/api/careerSwap", careerSwapRoute);
app.use("/api/roadmap", roadmapRoute);
app.use("/api/microlearning", microlearningRoute);




module.exports = app;