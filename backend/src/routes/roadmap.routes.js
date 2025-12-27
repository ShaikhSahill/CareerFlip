const express = require("express");
const router = express.Router();
const { generateRoadmap } = require("../controller/roadmap.controller");
const { scheduleRoadmap } = require("../controller/schedule.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.post("/generate", generateRoadmap);
router.post("/schedule", authMiddleware, scheduleRoadmap);

module.exports = router;