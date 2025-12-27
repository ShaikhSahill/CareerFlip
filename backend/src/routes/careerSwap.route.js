const express = require("express");
const multer = require("multer");
const { uploadPdf } = require("../controller/careerSwap.controller");

const router = express.Router();

// Multer setup (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// POST /api/pdf/upload
// console.log(upload)
router.post("/upload", upload.single("pdfFile"), uploadPdf);

module.exports = router;