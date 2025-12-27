const {generateContent} = require('../services/miroLearning.service');
async function createMicrolearningContent(req, res) {
    try {
        const { topic, format } = req.body; 
        console.log(`"controller:"${topic},${format}`)
        const content = await generateContent(topic, format);
        res.status(200).json({ content });
        
    }
    catch (error) {
        console.error("Error generating microlearning content:", error);
        res.status(500).json({ error: "Failed to generate content" });
    }
}
module.exports = { createMicrolearningContent };