const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate professional documentation-style educational content
 * @param {string} topic - Any language, framework, library, tool, or concept
 * @param {string} format - "module" (full docs) | "quick" (3-section crash course)
 */
const generateContent = async (topic, format) => {
  try {
    const isQuick = format === "quick";

    const systemInstruction = `
You are an elite technical documentation writer — like the authors of MDN Web Docs, Python official docs, or React docs.

Your job is to produce PROFESSIONAL, BEGINNER-FRIENDLY documentation for any programming language, framework, library, tool, or concept that a user asks about.

ABSOLUTE RULES:
1. Output ONLY valid JSON — no markdown, no explanation text outside the JSON.
2. Follow the exact JSON structure below. No extra or missing fields.
3. Language: Clear, simple English. Explain like the reader is smart but new to this topic.
4. Code examples: Must be real, runnable, and educational. Use proper indentation.
5. Every section must have both explanation text AND at least one code example.
6. Do NOT use backtick (\`) inside string values — use regular quotes or escape them.
7. codeExample must be a plain multi-line string (no markdown fences).
8. commonMistakes and bestPractices are SHORT bullet strings (1 sentence each, max 8 items).

JSON STRUCTURE (follow exactly):
{
  "mainTitle": "string — e.g. 'React Hooks — Complete Guide'",
  "description": "string — 1-2 sentence overview of what this topic is and why it matters",
  "language": "string — programming language or 'General' if applicable",
  "navItems": [
    { "navTitle": "string — section name" }
  ],
  "content": [
    {
      "contentTitle": "string — section title",
      "overview": "string — 2-4 sentence plain-language explanation of this section",
      "syntax": "string — the basic syntax pattern (omit if not applicable, use empty string)",
      "parameters": [
        { "name": "string", "description": "string" }
      ],
      "codeExample": "string — full working code example (multi-line, no markdown fences)",
      "codeLanguage": "string — e.g. javascript, python, bash, etc.",
      "explanation": "string — step-by-step walkthrough of the code example",
      "commonMistakes": ["string", "string"],
      "bestPractices": ["string", "string"]
    }
  ]
}
`;

    const sectionCount = isQuick ? 3 : 8;
    const depthNote = isQuick
      ? "This is a QUICK crash course — generate exactly 3 sections. Keep explanations focused and concise. Pick the 3 most essential concepts."
      : "This is a FULL MODULE — generate 7-10 sections covering the topic comprehensively from basics to advanced usage. Be thorough and detailed.";

    const userPrompt = `
Generate ${isQuick ? "a quick crash course" : "complete professional documentation"} for: "${topic}"

${depthNote}

For this topic, the sections should logically progress from introduction → core concepts → advanced usage${isQuick ? "" : " → real-world examples → best practices"}.

Ensure:
- navItems and content arrays have the SAME LENGTH (one nav entry per content section)
- Every content section has a real, working code example
- The documentation reads like it came from an official source (MDN, Python docs, React docs)
- Parameters array can be empty [] if the section has no function/method parameters
- commonMistakes and bestPractices: include 2-3 items each

Generate now for topic: "${topic}"
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        { role: "model", parts: [{ text: systemInstruction }] },
        { role: "user", parts: [{ text: userPrompt }] }
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      }
    });

    const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text
      || response?.text
      || "";

    let parsedContent;
    try {
      // Strip markdown fences if model wraps JSON anyway
      const cleaned = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
      parsedContent = JSON.parse(cleaned);
    } catch (e) {
      console.error("❌ Failed to parse JSON response:", rawText?.slice(0, 300));
      return fallback(topic, format);
    }

    // Validate structure
    if (!parsedContent.mainTitle || !Array.isArray(parsedContent.content) || parsedContent.content.length === 0) {
      console.error("❌ Invalid structure in response");
      return fallback(topic, format);
    }

    // Enforce quick format (exactly 3 sections)
    if (isQuick) {
      parsedContent.navItems = (parsedContent.navItems || []).slice(0, 3);
      parsedContent.content = parsedContent.content.slice(0, 3);
    }

    // Ensure every content item has all required fields with safe defaults
    parsedContent.content = parsedContent.content.map((item, i) => ({
      contentTitle: item.contentTitle || `Section ${i + 1}`,
      overview: item.overview || item.explanation || "Introduction to this concept.",
      syntax: item.syntax || "",
      parameters: Array.isArray(item.parameters) ? item.parameters : [],
      codeExample: item.codeExample || item.codeExamples || `// Example for ${topic}`,
      codeLanguage: item.codeLanguage || "javascript",
      explanation: item.explanation || item.overview || "",
      commonMistakes: Array.isArray(item.commonMistakes) ? item.commonMistakes : [],
      bestPractices: Array.isArray(item.bestPractices) ? item.bestPractices : [],
    }));

    return parsedContent;

  } catch (error) {
    console.error("❌ Error generating content:", error);
    return fallback(topic, format);
  }
};

/* ── FALLBACK ─────────────────────────────────────────────────────── */
function fallback(topic, format) {
  return {
    mainTitle: `${topic} — Documentation`,
    description: `A comprehensive guide to ${topic}.`,
    language: "General",
    navItems: [{ navTitle: "Introduction" }],
    content: [
      {
        contentTitle: "Introduction",
        overview: `Welcome to ${topic}. This guide couldn't be loaded — please try again.`,
        syntax: "",
        parameters: [],
        codeExample: `// Example for ${topic}\nconsole.log("Hello, ${topic}!");`,
        codeLanguage: "javascript",
        explanation: "Please try generating the content again.",
        commonMistakes: [],
        bestPractices: [],
      }
    ]
  };
}

module.exports = { generateContent };
