const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const userRoute = require("../src/routes/user.route");
const morgan = require("morgan");
const passport = require("passport");
require('../src/config/passport'); // Import passport config
const careerSwapRoute = require("../src/routes/careerSwap.route");
const roadmapRoute = require("../src/routes/roadmap.routes");
const microlearningRoute = require("../src/routes/microlearning.route");




app.use(express.json());
app.use(cors({
        origin: [
            'http://localhost:5173',
            'https://career-flip.vercel.app'
        ],
        credentials: true
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(morgan("dev"));


app.use("/api/user", userRoute);
app.use("/api/careerSwap", careerSwapRoute);
app.use("/api/roadmap", roadmapRoute);
app.use("/api/microlearning", microlearningRoute);


module.exports = app;