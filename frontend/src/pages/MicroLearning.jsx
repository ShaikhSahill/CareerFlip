import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// SVG Icons as functional components for better reusability and clarity
const SearchIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const QuickLessonIcon = () => (
    <svg className="w-8 h-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
);

const ModuleIcon = () => (
    <svg className="w-8 h-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L12 15.25l5.571-3M6.429 9.75L12 6.75l5.571 3m0 0l4.179 2.25L12 15.25l-4.179-2.25m11.142 0l-5.571 3-5.571-3" />
    </svg>
);

const RoadmapIcon = () => (
     <svg className="w-8 h-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);

const GenerateIcon = () => (
    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.528L16.5 21.75l-.398-1.222a2.997 2.997 0 00-2.122-2.122L12.75 18l1.222-.398a2.997 2.997 0 002.122-2.122L16.5 14.25l.398 1.222a2.997 2.997 0 002.122 2.122L20.25 18l-1.222.398a2.997 2.997 0 00-2.122 2.122z" />
    </svg>
);

// Data for the learning format cards
const learningFormats = [
    { id: 'quick', title: 'Quick', duration: '10-15 mins', icon: <QuickLessonIcon /> },
    { id: 'module', title: 'Module', duration: '1-1.5 hrs', icon: <ModuleIcon /> }
];

// Reusable component for the learning format cards
const LearningFormatCard = ({ format, selectedFormat, onSelect }) => {
    const isSelected = format.id === selectedFormat;
    
    return (
        <div 
            onClick={() => onSelect(format.id)}
            className={`
                bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center
                cursor-pointer transition-all duration-300
                border-2 ${isSelected ? 'border-purple-500 shadow-lg' : 'border-transparent hover:border-purple-300'}
            `}
        >
            <div className="flex justify-center mb-3">{format.icon}</div>
            <h3 className="font-bold text-slate-800">{format.title}</h3>
            <p className="text-sm text-slate-500">{format.duration}</p>
        </div>
    );
};

const MicroLearning = () => {
    // State to manage the user's topic input and selected learning format
    const [topic, setTopic] = useState('');
    const [selectedFormat, setSelectedFormat] = useState('module');
    const [loading, setLoading] = useState(false); // 'module' is selected by default
    const navigate = useNavigate();


    const handleGenerate = async() => {
        // This is where you would handle the content generation logic
        if (!topic) {
            alert("Please enter a topic to generate learning content.");
            return;
        }
        if(!selectedFormat){
            alert("Please select a learning format.");
            return;
        }
        console.log(
            topic,
            selectedFormat
        )
         setLoading(true);
        try {
            const res = await axios.post('https://careerflip.onrender.com/api/microlearning/generate-content', {
                withCredentials: true,
                topic,
                format: selectedFormat
            });
            setLoading(false);
            
            console.log(res.data)
            navigate('/mirolearning/generate', {state: { content: res.data.content, topic, format: selectedFormat }});
        } catch (err) {
            setLoading(false);
            alert('Failed to generate roadmap. Please try again.');
            console.log(err);
        }
        
        
        console.log(`Generating content for topic: "${topic}" with format: "${selectedFormat}"`);
        // You would typically make an API call here.
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <svg className="animate-spin h-12 w-12 text-purple-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <div className="text-xl font-semibold text-purple-700">Personalizing content..</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-100 font-sans">
            <div className="w-full max-w-2xl mx-auto text-center">
                
                {/* Header Section */}
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
                    What Can I Help You Learn?
                </h1>
                <p className="text-slate-600 mb-10">
                    Enter a topic below to generate a personalized course for it
                </p>

                {/* Search Bar with integrated Generate Button */}
                <div className="relative mb-8 shadow-sm">
                    <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 pointer-events-none" />
                    <input 
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter any topic you want to master..."
                        className="w-full h-16 pl-16 pr-[120px] sm:pr-[260px] text-lg bg-white/80 backdrop-blur-sm rounded-full border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-shadow"
                    />
                    <button 
                        onClick={handleGenerate}
                        className="
                            absolute right-2 top-1/2 -translate-y-1/2
                            flex items-center justify-center gap-2
                            h-12 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white 
                            font-semibold rounded-full text-sm shadow-md
                            transition-transform transform hover:scale-105
                            focus:outline-none focus:ring-4 focus:ring-purple-300
                        "
                    >
                        <GenerateIcon />
                        <span className="hidden sm:inline">Generate Learning Content</span>
                        <span className="sm:hidden">Generate</span>
                    </button>
                </div>

                {/* Learning Format Selector */}
                <div className="mb-10">
                    <h2 className="text-lg font-semibold text-slate-700 mb-5">
                        Choose your learning format
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto">
                        {learningFormats.map((format) => (
                            <LearningFormatCard 
                                key={format.id}
                                format={format}
                                selectedFormat={selectedFormat}
                                onSelect={setSelectedFormat}
                            />
                        ))}
                    </div>
                </div>
                
                {/* The main generate button has been moved into the search bar */}

            </div>
        </div>
    );
};

export default MicroLearning;

