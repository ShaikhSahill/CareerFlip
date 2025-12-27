const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const ai = new GoogleGenAI({});



const generateFullRoadmap = async (domain, level) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `
You are an expert AI curriculum designer, learning strategist, and roadmap architect.  

A user wants a full learning roadmap for the domain: "${domain}" at the level: "${level} to Expert in detailed ".  

Your task is to generate a **complete, actionable, and frontend-ready roadmap** from 0% to 100% completion, combining both Stage 1 (detailed roadmap) and Stage 2 (React Flow JSON) in a single structured output.  

### Instructions

1. **Roadmap Generation**
   - Include all stages appropriate for the selected level:
     - Beginner → foundational stages only
     - Intermediate → foundational + intermediate stages
     - Expert → all stages (foundational + intermediate + advanced)
   - For each stage, include:
     - **Focus Area / Skill Cluster**
     - **Topics / Subtopics**
     - **Learning Sequence / Recommended Order**
     - **Prerequisite skills** if any
   - Provide a **logical progression** from 0% → 100% mastery.
   - Ensure the roadmap is **detailed enough** for frontend display and for Stage 2 React Flow generation.

2. **React Flow JSON Generation**
   - Include:
     - \`title\`: string, e.g., "Frontend Developer Roadmap"
     - \`progress\`: number (0-100), estimated completion percentage
     - \`nodes\`: array of nodes for React Flow
     - \`edges\`: array of edges for React Flow
     - \`faqs\`: optional array of { q, a } objects
   - Nodes:
     - Include stages as nodes (Core/Foundation, Intermediate/Integration, Advanced/Expert)
     - Include focus areas/skill clusters as nodes
     - Horizontal Layout Requirement: 
       - Nodes should be positioned in a left-to-right sequence for stages.
       - Within a stage, nodes should be horizontally aligned (x-axis increases, y-axis mostly constant for same level).
     - Node properties:
       - \`id\`: unique
       - \`type\`: "custom"
       - \`position\`: { x: <number>, y: <number> } (sequential; frontend will adjust)
       - \`data\`: { label: name, topics/subtopics if any }
       
   - Edges:
     - Connect stages in sequence
     - Connect focus areas sequentially within each stage
     - Connect first focus area in each stage from its previous stage
     - Edge properties:
       - \`id\`: unique
       - \`source\`: starting node id
       - \`target\`: ending node id
       - \`type\`: "smoothstep"
       - Optional: \`animated\`, \`style\`

3. **Logical Flow**
   - Ensure all nodes are reachable from the first stage.
   - No dangling or disconnected nodes.
   - Reflect exact learning sequence without missing connections.

4. **FAQs**
   - Include a few common FAQs for the role in { q, a } format.

5. **Output Format**
\`\`\`json
{
  "RoleName": {
    "title": "RoleName Roadmap",
    "progress": 0,
    "nodes": [...],
    "edges": [...],
    "faqs": [...]
  }
}
\`\`\`

- Use **Structured Output Control** to strictly follow JSON format.
- **Do not include any commentary or explanation** outside the JSON.

Now generate the full roadmap for the domain: "${domain}" at the level: "${level}".
`
                        },
                    ],
                },
            ],
            config: {
                systemInstruction: "Generate a fully detailed learning roadmap and React Flow JSON in a single structured JSON object as described.",
                responseMimeType: "application/json",
                temperature: 0.2,
            },
        });

        // console.log(response.text);
        return JSON.parse(response.text);
    } catch (err) {
        console.error("Error generating full roadmap:", err);
        throw err;
    }
};








module.exports = {
    generateFullRoadmap
};

