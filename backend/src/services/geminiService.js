const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

const transformQuery = async (userQuery) => {
    try {
        const prompt = `Convert the career role or domain "${userQuery}" into a specific, high-quality YouTube search query for a relevant career-focused course in english,Hindi .
If the input is a broad field (e.g., Data Science, AI, Cloud), intelligently infer the most common associated career role (e.g., Data Science → Data Scientist / Data Science Engineer).
Ensure the query targets beginner-to-advanced structured courses, includes real-world projects, and filters for content from 2024 or 2025 only.
Return only the final YouTube search query.
        Example Input: "Web Developer" -> Output: "MERN stack full course hindi 2025"
        Example Input: "React Developer" -> Output: "React js full course hindi 2025"
        Example Input: "Backend Engineer" -> Output: "Node js express mongodb course hindi 2025"
        
        Input: "${userQuery}"
        Output (just the search query string):`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text.trim();
    } catch (error) {
        console.error("Error in transformQuery:", error);
        return `${userQuery} course hindi 2025`; // Fallback
    }
};

const generateLearningPath = async (videoTitle, channelTitle) => {
    try {
        const prompt = `Create a very brief (1-2 sentences) 'Learning Path' tip for a student about to watch this video/playlist.
        Video: "${videoTitle}" by ${channelTitle}.
        Example Output: "Start here to master the basics of React hooks and component structure."
        
        Tip:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text.trim();
    } catch (error) {
        console.error("Error in generateLearningPath:", error);
        return "Recommended for deep diving into this topic.";
    }
};

module.exports = { transformQuery, generateLearningPath };
