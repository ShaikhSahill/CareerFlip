const ImageKit = require("imagekit");
require("dotenv").config();

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});


async function uploadFile(fileBuffer, fileName) {
    try {
        // console.log(`Uploading to ImageKit: ${fileName}, Size: ${fileBuffer.length} bytes`);
        const response = await imagekit.upload({
            file: fileBuffer, // Buffer
            fileName: fileName,
            folder: "resumes",
        });

        return response;
    } catch (error) {
        console.error("ImageKit Upload Error:", error);
        throw error;
    }
}

module.exports = { uploadFile };