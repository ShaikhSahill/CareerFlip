const { summarizePdf, analyzeCareerSwap } = require("../services/careerSwap.service");
const { uploadFile } = require("../services/imageKit.service");
const fs = require("fs").promises;

async function uploadPdf(req, res) {
    try {
        // console.log(req.file)
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const fileBuffer = req.file.buffer;
        const userswap = req.body;
        const { currentRole, targetRole } = userswap;
        const displayName = req.file.originalname;
        const fileSize = req.file.size;

        console.log(`Processing PDF: ${displayName}, Size: ${fileSize} bytes`);

        // Upload to ImageKit (using buffer)
        console.log("Uploading to ImageKit...");
        const imageKitResponse = await uploadFile(fileBuffer, displayName);
        const fileUrl = imageKitResponse.url;
        console.log("ImageKit Upload Success:", fileUrl);

        // Generate Summary using the BUFFER directly (faster/simpler than fetching URL)
        console.log("Generating summary from memory buffer...");
        const summary = await summarizePdf(fileBuffer, displayName, fileSize);
        // No local file deletion needed as we used memory storage

        console.log(currentRole, targetRole);
        const analysisResult = await analyzeCareerSwap(summary, currentRole, targetRole);
        res.json({ analysisResult });
    } catch (error) {
        console.error("❌ Error processing PDF:", error);
        res.status(500).json({ error: "Failed to process PDF" });
    }
}

module.exports = { uploadPdf };
