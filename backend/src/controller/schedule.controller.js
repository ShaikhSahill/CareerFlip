const { google } = require('googleapis');
const { userModel } = require('../models/user.model');
const Schedule = require('../models/schedule.model');
const Roadmap = require('../models/roadmap.model');

const scheduleRoadmap = async (req, res) => {
    console.log("DEBUG: scheduleRoadmap handler called!");
    try {
        const userId = req.user._id; // Assuming auth middleware populates req.user
        const { roadmapId, startTime, endTime, targetEndDate, skipWeekends } = req.body;

        // 1. Fetch User and Roadmap
        const user = await userModel.findById(userId);
        if (!user || !user.googleAccessToken) {
            return res.status(401).json({ error: "User not authenticated with Google or missing tokens." });
        }

        // Fetch roadmap - generic approach since roadmap might be passed in body or ID
        // For this MVP, we assume frontend sends the roadmap data or ID. 
        // If ID is sent:
        // const roadmap = await Roadmap.findById(roadmapId);
        // But looking at previous code, roadmap data is often just passed or generated. 
        // Let's assume frontend sends the roadmap object structure directly or we fetch if ID exists.
        // The prompt says "Fetch roadmap data". 
        // Let's assume we fetch by ID.
        let roadmapData;
        const roadmapDoc = await Roadmap.findById(roadmapId);
        
        if (!roadmapDoc) {
             return res.status(404).json({ error: "Roadmap not found" });
        }
        roadmapData = roadmapDoc.roadmapData;
        
        // Extract the actual roadmap object (it might be nested under role name)
        // detailed structure: { "RoleName": { nodes: [], ... } } OR just { nodes: [] }
        // The model says roadmapData is Object.
        const rawData = roadmapDoc.roadmapData;
        let nodes = [];
        
        // Handle different structures
        if (rawData.nodes) {
            nodes = rawData.nodes;
        } else {
             const keys = Object.keys(rawData);
             if (keys.length > 0 && rawData[keys[0]].nodes) {
                 nodes = rawData[keys[0]].nodes;
             }
        }

        if (!nodes || nodes.length === 0) {
            return res.status(400).json({ error: "Invalid roadmap data: No nodes found." });
        }

        // 2. Linearize Roadmap
        // Filter nodes that have topics/subtopics
        const learningTasks = [];
        
        // Sort nodes roughly by Y position then X position to ensure logical order if not strictly linear
        nodes.sort((a, b) => {
            if (Math.abs(a.position.y - b.position.y) > 50) {
                return a.position.y - b.position.y;
            }
            return a.position.x - b.position.x;
        });

        nodes.forEach(node => {
            const data = node.data;
            if (data && (data.topics || data.subtopics)) {
                const topics = data.topics || data.subtopics;
                if (Array.isArray(topics)) {
                    topics.forEach(topic => {
                        let topicName = typeof topic === 'string' ? topic : (topic.name || topic.title || "Topic");
                        learningTasks.push({
                            title: `Learn: ${topicName}`,
                            description: `Focus on ${topicName} from ${data.label || 'Roadmap'}`,
                            nodeId: node.id
                        });
                    });
                }
            }
        });

        if (learningTasks.length === 0) {
             return res.status(400).json({ error: "No actionable learning topics found in roadmap." });
        }

        // 3. Calculate Schedule Distribution
        const startHour = parseInt(startTime.split(':')[0]);
        const startMin = parseInt(startTime.split(':')[1] || '0');
        const endHour = parseInt(endTime.split(':')[0]);
        const endMin = parseInt(endTime.split(':')[1] || '0');
        
        const today = new Date();
        today.setHours(0,0,0,0);
        const targetDate = new Date(targetEndDate);
        
        // Calculate total available days
        let currentDate = new Date(today);
        currentDate.setDate(currentDate.getDate() + 1); // Start tomorrow
        
        const schedulePlan = [];
        let taskIndex = 0;
        
        // Iterate days until all tasks scheduled or target date reached (soft limit)
        // We will schedule all tasks, extending past target date if necessary, but trying to fit.
        // Actually, let's just schedule sequentially day by day.
        
        while (taskIndex < learningTasks.length) {
            // Check skip weekends
            const dayMap = currentDate.getDay(); // 0 is Sunday, 6 is Saturday
            if (skipWeekends && (dayMap === 0 || dayMap === 6)) {
                currentDate.setDate(currentDate.getDate() + 1);
                continue;
            }

            // Create event for this day
            // For simplicity, 1 task per day? Or distribute evenly?
            // "Distribute tasks across available days"
            // Let's try to fit multiple tasks if the duration is long?
            // MVP: 1-2 tasks per day depending on count vs days ratio?
            // Let's stick to a simple 1 hour or full slot per task? 
            // The user said: "Daily time range (2 PM - 5 PM)". 
            // That's a 3 hour block. We can put multiple topics in that block or just one "Study Session".
            // Objective 3: "Each calendar event should include... Title: CareerFlip: <Topic Name>"
            // If we have 100 topics, we can't make 100 events per day.
            // Let's group topics for the day into one event description?
            // REQUIREMENT: "Each calendar event should include... Title: CareerFlip: <Topic Name>" implies individual events?
            // If there are too many topics, this will spam the calendar. 
            // Better approach: "CareerFlip: Study Session - <Topic 1>, <Topic 2>"
            // BUT requirement says: Title: “CareerFlip: <Topic Name>”
            // Let's try to map 1 Topic to 1 Event if compatible, or maybe spread them out. 
            // If we have 50 topics and 10 days, that's 5 topics/day.
            // We can split the 2PM-5PM block into 5 slots.
            
            const timeDiff = targetDate - today;
            const daysAvailable = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            const remainingTasks = learningTasks.length - taskIndex;
            // tasks per day = ceil(remaining / remainingDays)
            // But simplify: Just do 1-2 topics per day to start, filling slots.
            
            // Let's simply stack them in the time slot.
            // Duration per task = (EndTime - StartTime) / TasksToday
            // We need to know how many tasks for THIS day.
            // Let's calculate TasksPerDay roughly.
            let tasksPerDay = Math.ceil(learningTasks.length / Math.max(1, daysAvailable));
            if (tasksPerDay < 1) tasksPerDay = 1;

            const slotDurationMinutes = ((endHour * 60 + endMin) - (startHour * 60 + startMin));
            const taskDurationMinutes = Math.floor(slotDurationMinutes / tasksPerDay);

            let currentSlotStart = new Date(currentDate);
            currentSlotStart.setHours(startHour, startMin, 0);

            for (let i = 0; i < tasksPerDay && taskIndex < learningTasks.length; i++) {
                const task = learningTasks[taskIndex];
                
                const eventStart = new Date(currentSlotStart);
                const eventEnd = new Date(currentSlotStart.getTime() + taskDurationMinutes * 60000);

                schedulePlan.push({
                    summary: `CareerFlip: ${task.title.replace('Learn: ', '')}`,
                    description: task.description,
                    start: eventStart,
                    end: eventEnd
                });

                // Advance slot
                currentSlotStart = eventEnd;
                taskIndex++;
            }
            
            // Next day
            currentDate.setDate(currentDate.getDate() + 1);
        }

        console.log("DEBUG: Schedule Plan Generated:", JSON.stringify(schedulePlan, null, 2));
        if (schedulePlan.length > 0) {
            console.log("DEBUG: First Event Start:", schedulePlan[0].start);
            console.log("DEBUG: Last Event End:", schedulePlan[schedulePlan.length - 1].end);
        } else {
            console.log("DEBUG: Schedule Plan is EMPTY!");
        }

        // 4. Create Google Calendar Events
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "https://careerflip.onrender.com/api/user/auth/google/callback" // Absolute URL
        );

        oauth2Client.setCredentials({
            access_token: user.googleAccessToken,
            refresh_token: user.googleRefreshToken
        });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        const createdEvents = [];
        const errors = [];

        // Batch processing or sequential? Sequential to avoid rate limits
        for (const event of schedulePlan) {
            try {
                const response = await calendar.events.insert({
                    calendarId: 'primary',
                    requestBody: {
                        summary: event.summary,
                        description: event.description,
                        start: { dateTime: event.start.toISOString() },
                        end: { dateTime: event.end.toISOString() },
                    }
                });
                createdEvents.push({
                    eventId: response.data.id,
                    summary: event.summary,
                    startTime: event.start,
                    endTime: event.end,
                    htmlLink: response.data.htmlLink
                });
            } catch (err) {
                console.error("Error creating calendar event:", err);
                errors.push(err.message);
            }
        }

        if (createdEvents.length === 0) {
            return res.status(500).json({ 
                error: "Failed to create any calendar events. Google API Error: " + (errors[0] || "Unknown error"),
                details: errors 
            });
        }

        // 5. Save Schedule to DB
        const newSchedule = new Schedule({
            userId: user._id,
            roadmapId: roadmapDoc._id,
            roadmapTitle: roadmapData.title || (Object.keys(roadmapData)[0] ? roadmapData[Object.keys(roadmapData)[0]].title : "Roadmap"),
            googleCalendarEvents: createdEvents,
            preferences: { startTime, endTime, targetEndDate, skipWeekends }
        });

        await newSchedule.save();

        const firstEventStr = createdEvents.length > 0 ? createdEvents[0].startTime : "N/A";
        const lastEventStr = createdEvents.length > 0 ? createdEvents[createdEvents.length-1].endTime : "N/A";

        res.status(200).json({ 
            message: `Success! Scheduled ${createdEvents.length} tasks.\nFrom: ${firstEventStr}\nTo: ${lastEventStr}`,
            eventsCreated: createdEvents.length,
            scheduleId: newSchedule._id,
            warnings: errors.length > 0 ? errors : null
        });

    } catch (error) {
        console.error("Scheduling Error:", error);
        res.status(500).json({ error: "Failed to schedule roadmap. " + error.message });
    }
};

module.exports = { scheduleRoadmap };
