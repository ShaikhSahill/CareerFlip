const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roadmapId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roadmap', // Assuming you have a Roadmap model
        required: true
    },
    roadmapTitle: {
        type: String
    },
    googleCalendarEvents: [{
        eventId: String,
        summary: String,
        startTime: Date,
        endTime: Date,
        htmlLink: String
    }],
    preferences: {
        startTime: String,
        endTime: String,
        targetEndDate: Date,
        skipWeekends: Boolean
    }
}, { timestamps: true });

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;
