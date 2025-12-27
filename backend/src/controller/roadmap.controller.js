const { generateFullRoadmap
} = require("../services/roadmap.service");
const Roadmap = require("../models/roadmap.model");



const generateRoadmap = async (req, res) => {
    try {
        const { domain, level } = req.body;
        console.log(domain, level);
        
        // Check if roadmap already exists in database
        const existingRoadmap = await Roadmap.findOne({ domain, level });
        
        if (existingRoadmap) {
            console.log("Roadmap found in database, returning cached data");
            return res.status(200).json({ 
                roadmap: existingRoadmap.roadmapData,
                roadmapId: existingRoadmap._id,
                cached: true 
            });
        }
        
        // Generate new roadmap if not found in database
        console.log("Roadmap not found in database, generating new one");
        const finalResponse = await generateFullRoadmap(domain, level); 
        
        let newRoadmapId = null;
        if (finalResponse) {
            try {
                const roadmapEntry = new Roadmap({      
                    domain,
                    level,
                    roadmapData: finalResponse   
                });
                
                const savedRoadmap = await roadmapEntry.save();
                newRoadmapId = savedRoadmap._id;
                console.log("New roadmap saved to database");
            } catch (error) {
                console.log("Error saving roadmap to database:", error.message);
            }
        }
        
        res.status(200).json({ 
            roadmap: finalResponse,
            roadmapId: newRoadmapId,
            cached: false 
        });
        
    } catch (error) {
        console.error("Error generating roadmap:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { generateRoadmap };