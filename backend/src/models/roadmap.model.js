const mongoose = require('mongoose');
const roadmapSchema = new mongoose.Schema({
    domain: {
        type: String,
        required: true,

    },  
    level: {
        type: String,
        required: true,
    },
    roadmapData: {  
        type: Object,
        required: true,
    },
}, { timestamps: true });   

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
module.exports = Roadmap;
