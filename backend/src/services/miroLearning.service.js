const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate W3Schools-style educational content in strict JSON format
 * @param {string} topic - Any framework, library, npm, pip, OSS
 * @param {string} format - "module" | "quick"
 */
const generateContent = async (topic, format) => {
  try {
    /* ================= SYSTEM INSTRUCTION ================= */
    const systemInstruction = `
You are an expert technical documentation writer.

STRICT RULES:
- Output ONLY valid JSON
- No markdown
- No text outside JSON
- Use simple beginner-friendly language
- Code examples MUST use backticks (\`)
- Follow the JSON structure exactly
`;

    /* ================= USER PROMPT ================= */
    const userPrompt = `
Generate content for topic: "${topic}"

FORMAT RULES (VERY IMPORTANT):

IF format === "module":
- Generate FULL documentation similar to official docs
- Well-structured and detailed
- navItems can be many
- Each navItem must have detailed content
- Include multiple code examples

IF format === "quick":
- Generate a QUICK beginner lesson
- navItems MUST contain EXACTLY 3 items
- content MUST contain EXACTLY 3 sections
- Each section MUST include:
  - Clear explanation
  - At least ONE code example
- Keep language very simple

STRICT JSON STRUCTURE (NO EXTRA FIELDS):

{
  "mainTitle": "Title for ${topic}",
  "navItems": [
    { "navTitle": "Section Name" }
  ],
  "content": [
    {
      "contentTitle": "Section Title",
      "explanation": "Clear beginner-friendly explanation.",
      "codeExamples": "Code wrapped in backticks."
    }
  ]
}

Current format: "${format}"

Generate now.
`;

    /* ================= GEMINI CALL ================= */
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "model", parts: [{ text: systemInstruction }] },
        { role: "user", parts: [{ text: userPrompt }] }
      ]
    });

    const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    /* ================= SAFE PARSE ================= */
    let parsedContent = {};
    try {
      parsedContent = JSON.parse(rawText);

      if (!parsedContent.mainTitle) {
        parsedContent.mainTitle = topic;
      }

      if (!Array.isArray(parsedContent.navItems)) {
        parsedContent.navItems = getDefaultNavItems(topic);
      }

      if (!Array.isArray(parsedContent.content)) {
        parsedContent.content = [];
      }

      /* ===== ENFORCE QUICK FORMAT STRICTLY ===== */
      if (format === "quick") {
        // Force exactly 3 nav items
        parsedContent.navItems = parsedContent.navItems.slice(0, 3);

        // Force exactly 3 content sections
        parsedContent.content = parsedContent.content.slice(0, 3);

        // Ensure codeExamples exist
        parsedContent.content = parsedContent.content.map((item, index) => ({
          contentTitle: item.contentTitle || parsedContent.navItems[index]?.navTitle || `Section ${index + 1}`,
          explanation: item.explanation || `Basic explanation of ${topic}.`,
          codeExamples: item.codeExamples || `console.log("Learning ${topic}");`
        }));
      }

    } catch (e) {
      console.error("❌ Failed to parse JSON:", rawText);
      return fallback(topic, format);
    }

    return parsedContent;
  } catch (error) {
    console.error("❌ Error generating content:", error);
    return fallback(topic, format);
  }
};

/* ================= FALLBACK ================= */
function fallback(topic, format) {
  if (format === "quick") {
    return {
      mainTitle: topic,
      navItems: [
        { navTitle: "Introduction" },
        { navTitle: "Basic Usage" },
        { navTitle: "Example" }
      ],
      content: [
        {
          contentTitle: "Introduction",
          explanation: `This section introduces ${topic}.`,
          codeExamples: `console.log("${topic} intro");`
        },
        {
          contentTitle: "Basic Usage",
          explanation: `This shows basic usage of ${topic}.`,
          codeExamples: `// basic usage example`
        },
        {
          contentTitle: "Example",
          explanation: `A simple example using ${topic}.`,
          codeExamples: `console.log("Example of ${topic}");`
        }
      ]
    };
  }

  return {
    mainTitle: topic,
    navItems: getDefaultNavItems(topic),
    content: [
      {
        contentTitle: "Introduction",
        explanation: `Welcome to ${topic}. This is a detailed guide.`,
        codeExamples: `console.log("Hello ${topic}");`
      }
    ]
  };
}

/**
 * Default navItems (used mainly for module fallback)
 */
function getDefaultNavItems(topic) {
  return [
    { navTitle: "Introduction" },
    { navTitle: "Installation" },
    { navTitle: "Core Concepts" },
    { navTitle: "API Usage" },
    { navTitle: "Examples" },
    { navTitle: "Best Practices" }
  ];
}

module.exports = { generateContent };
