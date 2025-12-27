const { GoogleGenAI } = require("@google/genai");
const fs = require("fs"); // Keeping if needed elsewhere, but buffer usage doesn't need it for reading file
const { transformQuery, generateLearningPath } = require('./geminiService');
const { searchVideos } = require('./youtubeService');
require("dotenv").config();

// Initialize Gemini client
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


async function summarizePdf(pdfBuffer, displayName, fileSize) {
    try {
        console.log(`\n📄 Processing PDF Buffer: ${displayName} (${fileSize || "unknown"} bytes)`);
        console.log("Gemini API key:", process.env.GEMINI_API_KEY ? "Loaded ✅" : "❌ Missing");


        // Convert buffer to base64
        const pdfBase64 = pdfBuffer.toString("base64");

        console.log(`🚀 Sending PDF to Gemini (inline upload mode)`);

        // Generate summary from Gemini
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `Summarize this PDF into clear bullet points and key highlights.`,
                        },
                        {
                            inlineData: {
                                mimeType: "application/pdf",
                                data: pdfBase64,
                            },
                        },
                    ],
                },
            ],
        });

        // ✅ Extract summary text safely
        if (response.text) return response.text;
        if (response.response?.text) return await response.response.text();
        if (response.output?.[0]?.content?.[0]?.text)
            return response.output[0].content[0].text;

        return "⚠️ No summary text returned by Gemini.";
    } catch (err) {
        console.error("❌ Error in summarizePdf():", err);
        throw err;
    }
}




async function getYouTubeRecommendations(targetCareer) {
    try {
        console.log(`🎥 Fetching YouTube recommendations for: ${targetCareer}`);

        // Transform the target career into a YouTube search query
        const transformedQuery = await transformQuery(targetCareer);
        console.log(`Transformed Query: ${transformedQuery}`);

        // Fetch videos from YouTube
        const youtubeResults = await searchVideos(transformedQuery);

        // Enhance with learning paths
        const enhancedResults = await Promise.all(youtubeResults.map(async (item) => {
            const title = item.snippet.title;
            const channelTitle = item.snippet.channelTitle;
            const learningPath = await generateLearningPath(title, channelTitle);

            return {
                id: item.id.playlistId || item.id.videoId,
                type: item.id.playlistId ? 'playlist' : 'video',
                title: title,
                thumbnail: item.snippet.thumbnails.high.url,
                channel: channelTitle,
                learningPath: learningPath,
                url: item.id.playlistId
                    ? `https://www.youtube.com/playlist?list=${item.id.playlistId}`
                    : `https://www.youtube.com/watch?v=${item.id.videoId}`
            };
        }));

        return enhancedResults;
    } catch (error) {
        console.error("❌ Error fetching YouTube recommendations:", error.message);
        return []; // Return empty array on error
    }
}

async function analyzeCareerSwap(resumeSummary, currentRole, targetRole) {
    console.log(currentRole, targetRole)
    try {
        const systemPrompt = `
You are an expert **Career Swap Consultant AI**.  
Your role is to analyze the user's resume summary useonly read Experience,skills,achivments,projects and soft skills and provide a highly accurate, structured output 
showing their only follow the current career as this only ${currentRole} don't refer the cv or resume   and target career as this only ${targetRole} don't refer the cv or resume, transferable skills, and skills to develop.

Strictly follow this JSON structure:

{
  "currentCareer": "Infer the user's current or most recent job title from the resume.",
  "targetCareer": "The user's most suitable or desired target career based on skills and interests.",
  "transferableSkills": [
    {
      "skill": "Name of a key skill from the resume relevant to the target career.",
      "relevanceScore": "Integer (0-100) showing relevance and strength."
    }
  ],
  "skillsToDevelop": [
    {
      "skill": "Important missing or weak skill or teach stack for target career.",
      "estimatedTimeToLearnInMonths": "Integer (1-12)"
    }
  ],
  "summaryMetrics": {
    "yourResumeRating": "Integer (0-10) show user there resume rating based on there projects ,experience,skills,achivments,soft skills(make sure to be a Professional resume evaluator and give rating accordingly)",
    "totalEstimatedTimeInMonths": "A string range like '8-12 months'.(make sure the time line is between or under 1-12 months)",
    "potentialSalaryIncreaseIndianRupees": "Integer range between 20k to 50k (eg: 20k,30k,40k,...etc).",
    "commitmentLevel": "One of: 'Low', 'Medium', 'High'."
  }
}

Return **only valid JSON**, no text or explanation.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.3,
            },
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `Resume Summary read only Experience,skills,achivments,projects from :\n${resumeSummary}\n\nGenerate the structured career transition output as specified for ${currentRole} to ${targetRole}.`,
                        },
                    ],
                },
            ],
        });

        // Try to extract JSON safely
        let rawText = response.text?.trim() || "";
        const jsonStart = rawText.indexOf("{");
        const jsonEnd = rawText.lastIndexOf("}");
        if (jsonStart >= 0 && jsonEnd > jsonStart) {
            rawText = rawText.slice(jsonStart, jsonEnd + 1);
        }

        const structuredOutput = JSON.parse(rawText);

        // Fetch YouTube recommendations based on target career
        const youtubeRecommendations = await getYouTubeRecommendations(targetRole);

        // Add YouTube recommendations to summaryMetrics
        structuredOutput.summaryMetrics.recommendedVideos = youtubeRecommendations;

        return structuredOutput;
    } catch (error) {
        console.error("❌ Error in analyzeCareerSwap:", error.message);
        return { error: "Failed to analyze career swap. Please try again." };
    }
}




module.exports = { summarizePdf, analyzeCareerSwap };
