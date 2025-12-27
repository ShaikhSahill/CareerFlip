import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// SVG Icons as Components for reusability
const SearchIcon = () => (
    <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const StarIcon = () => (
    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const BookmarkIcon = () => (
    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>
);

const GenerateIcon = () => (
     <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

// Data for roadmap cards
const roadmaps = [
    {
        title: 'AI Engineer',
        description: 'Master machine learning, deep learning, and AI model deployment',
        duration: '12 weeks',
        skills: '45',
        color: 'purple',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10c0-4.42-3.58-8-8-8"></path><path d="M12 2a10 10 0 0 0-10 10c0 4.42 3.58 8 8 8"></path><path d="M14 9a2 2 0 1 0-4 0v3a2 2 0 0 0 4 0v-3z"></path><path d="M12 17a2.5 2.5 0 0 0 2.5-2.5V12h-5v2.5A2.5 2.5 0 0 0 12 17z"></path></svg>
    },
    {
        title: 'Full Stack Developer',
        description: 'Build complete web applications from frontend to backend',
        duration: '16 weeks',
        skills: '38',
        color: 'blue',
        icon: <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
    },
    {
        title: 'Data Scientist',
        description: 'Analyze data, build models, and extract business insights',
        duration: '14 weeks',
        skills: '42',
        color: 'green',
        icon: <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
    },
    {
        title: 'DevOps Engineer',
        description: 'Automate deployment, infrastructure, and ensure scalability',
        duration: '12 weeks',
        skills: '35',
        color: 'orange',
        icon: <svg className="w-8 h-8 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>
    },
    {
        title: 'Mobile Developer',
        description: 'Create iOS and Android apps with modern frameworks',
        duration: '10 weeks',
        skills: '32',
        color: 'pink',
        icon: <svg className="w-8 h-8 text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
    },
    {
        title: 'Cybersecurity Specialist',
        description: 'Protect systems and data from cyber threats and attacks',
        duration: '15 weeks',
        skills: '40',
        color: 'red',
        icon: <svg className="w-8 h-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" /></svg>
    },
];

const suggestedRoadmaps = [
    {
        title: 'AI Engineer',
        description: 'Based on your interest in machine learning',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10c0-4.42-3.58-8-8-8"></path><path d="M12 2a10 10 0 0 0-10 10c0 4.42 3.58 8 8 8"></path><path d="M14 9a2 2 0 1 0-4 0v3a2 2 0 0 0 4 0v-3z"></path><path d="M12 17a2.5 2.5 0 0 0 2.5-2.5V12h-5v2.5A2.5 2.5 0 0 0 12 17z"></path></svg>
    },
    {
        title: 'Full Stack Developer',
        description: 'Perfect for your coding background',
        icon: <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
    },
    {
        title: 'Data Scientist',
        description: 'Matches your analytical skills',
        icon: <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
    }
];

const colorVariants = {
    purple: { border: 'border-purple-500', bg: 'bg-purple-100', text: 'text-purple-600', button: 'bg-purple-500 hover:bg-purple-600' },
    blue: { border: 'border-blue-500', bg: 'bg-blue-100', text: 'text-blue-600', button: 'bg-blue-500 hover:bg-blue-600' },
    green: { border: 'border-green-500', bg: 'bg-green-100', text: 'text-green-600', button: 'bg-green-500 hover:bg-green-600' },
    orange: { border: 'border-orange-500', bg: 'bg-orange-100', text: 'text-orange-600', button: 'bg-orange-500 hover:bg-orange-600' },
    pink: { border: 'border-pink-500', bg: 'bg-pink-100', text: 'text-pink-600', button: 'bg-pink-500 hover:bg-pink-600' },
    red: { border: 'border-red-500', bg: 'bg-red-100', text: 'text-red-600', button: 'bg-red-500 hover:bg-red-600' },
};

// Roadmap Card Component
const RoadmapCard = ({ title, description, duration, skills, color, icon, onSelect }) => {
    const variants = colorVariants[color] || colorVariants.purple;
    return (
        <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${variants.border} transition-transform hover:-translate-y-1`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 ${variants.bg} rounded-lg`}>{icon}</div>
                <button className={`text-slate-400 hover:${variants.text}`}>
                    <BookmarkIcon />
                </button>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-slate-500 text-sm mb-4 h-10">{description}</p>
            <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">{duration} • {skills} skills</span>
                <button onClick={() => onSelect(title)} className={`${variants.button} text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors`}>Select</button>
            </div>
        </div>
    );
};

// Suggested Card Component
const SuggestedCard = ({ title, description, icon, isFeatured, onClick }) => (
    <div onClick={onClick} className={`bg-white/20 p-4 rounded-lg backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-colors ${isFeatured ? 'border-2 border-white/50' : ''}`}>
        <div className="flex items-center gap-4">
             <div className="p-2 bg-white/20 rounded-md">
                {icon}
             </div>
             <div>
                <h4 className="font-semibold">{title}</h4>
                <p className="text-xs text-white/80">{description}</p>
             </div>
        </div>
    </div>
);

const RoadmapPage = () => {
    const [selectedLevel, setSelectedLevel] = useState('Beginner');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSuggestion, setSelectedSuggestion] = useState('Full Stack Developer');
    const [loading, setLoading] = useState(false); // <-- loading state
    const levels = ['Beginner', 'Intermediate', 'Expert'];

    const handleSelection = (title) => {
        setSearchTerm(title);
        setSelectedSuggestion(title);
    };

    const navigate = useNavigate();

    const handleRedirect = async () => {
        const chosen = searchTerm || selectedSuggestion   ;
        setLoading(true);
        try {
            const res = await axios.post('https://careerflip.onrender.com/api/roadmap/generate', {
                withCredentials: true,
                domain: chosen,
                level: selectedLevel
            });
            setLoading(false);
            
            console.log(res.data.roadmap);
            navigate('/flow', { 
                state: { 
                    selectedCareer: chosen, 
                    roadmap: res.data.roadmap,
                    roadmapId: res.data.roadmapId
                } 
            });
        } catch (err) {
            setLoading(false);
            alert('Failed to generate roadmap. Please try again.');
            console.log(err);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <svg className="animate-spin h-12 w-12 text-purple-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <div className="text-xl font-semibold text-purple-700">Personalizing road map</div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 text-slate-800 font-sans">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
                
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Choose Your Career Domain</h1>
                        <p className="text-slate-500 mt-1">Discover your path to success with AI-powered career guidance</p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-sm text-purple-700 bg-purple-100 rounded-full px-4 py-2 mt-4 sm:mt-0 transition-transform hover:scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600 bg-white p-1.5 rounded-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10c0-4.42-3.58-8-8-8"></path><path d="M12 2a10 10 0 0 0-10 10c0 4.42 3.58 8 8 8"></path><path d="M14 9a2 2 0 1 0-4 0v3a2 2 0 0 0 4 0v-3z"></path><path d="M12 17a2.5 2.5 0 0 0 2.5-2.5V12h-5v2.5A2.5 2.5 0 0 0 12 17z"></path></svg>
                        <span>"Pick a domain to begin your journey!"</span>
                    </button>
                </header>

                <div className="relative mb-4">
                    <SearchIcon />
                    <input 
                        type="text" 
                        placeholder="Search for AI, Web Development, Data Science..." 
                        className="w-full pl-12 pr-4 md:pr-[250px] py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none shadow-sm h-14"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleRedirect} className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 bg-white text-purple-700 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-100 transition-colors shadow">
                        <GenerateIcon />
                        <span className="hidden md:inline">Generate My Roadmap</span>
                    </button>
                </div>

                <div className="flex justify-center items-center gap-2 sm:gap-4 mb-8">
                    {levels.map((level) => (
                        <button
                            key={level}
                            onClick={() => setSelectedLevel(level)}
                            className={`px-4 py-2 text-sm sm:text-base sm:px-6 rounded-full font-semibold transition-colors duration-200 ${
                                selectedLevel === level
                                    ? 'bg-purple-600 text-white shadow-md'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>

                <div className="mb-12">
                     <div className="bg-gradient-to-r from-[#6B46C1] to-[#4A55A2] text-white p-6 rounded-xl shadow-lg">
                        <div className="flex items-center gap-2 mb-6">
                            <StarIcon />
                            <h3 className="font-semibold">Suggested for You</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {suggestedRoadmaps.map((suggestion) => (
                               <SuggestedCard 
                                    key={suggestion.title}
                                    title={suggestion.title}
                                    description={suggestion.description}
                                    icon={suggestion.icon}
                                    isFeatured={selectedSuggestion === suggestion.title}
                                    onClick={() => handleSelection(suggestion.title)}
                               />
                           ))}
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Most Popular Roadmaps</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {roadmaps.map(roadmap => (
                            <RoadmapCard 
                                key={roadmap.title} 
                                {...roadmap} 
                                onSelect={handleSelection} 
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RoadmapPage;

