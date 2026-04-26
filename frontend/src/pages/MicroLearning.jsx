import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../api';

// --- SVG Icons ---
const SearchIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const GenerateIcon = () => (
    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);

const learningFormats = [
    {
        id: 'quick',
        title: 'Quick Lesson',
        duration: '10–15 mins',
        description: '3 essential concepts to get you started fast.',
        icon: <QuickLessonIcon />,
    },
    {
        id: 'module',
        title: 'Full Module',
        duration: '1–1.5 hrs',
        description: 'Complete documentation from basics to advanced.',
        icon: <ModuleIcon />,
    },
];

const LearningFormatCard = ({ format, selectedFormat, onSelect }) => {
    const isSelected = format.id === selectedFormat;
    return (
        <div
            onClick={() => onSelect(format.id)}
            className={`
                bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center
                cursor-pointer transition-all duration-300 select-none
                border-2 ${isSelected
                    ? 'border-purple-500 shadow-xl shadow-purple-100 scale-[1.02]'
                    : 'border-transparent hover:border-purple-300 hover:shadow-md'
                }
            `}
        >
            <div className="flex justify-center mb-3">{format.icon}</div>
            <h3 className="font-bold text-slate-800 text-lg">{format.title}</h3>
            <p className="text-sm text-purple-600 font-medium mt-1">{format.duration}</p>
            <p className="text-xs text-slate-500 mt-1">{format.description}</p>
        </div>
    );
};

const MicroLearning = () => {
    const [topic, setTopic] = useState('');
    const [selectedFormat, setSelectedFormat] = useState('module');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGenerate = async () => {
        if (!topic.trim()) {
            alert('Please enter a topic to generate learning content.');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/microlearning/generate-content`,
                { topic: topic.trim(), format: selectedFormat },
                { withCredentials: true }
            );
            navigate('/mirolearning/generate', {
                state: { content: res.data.content, topic: topic.trim(), format: selectedFormat }
            });
        } catch (err) {
            console.error('Generation error:', err);
            alert('Failed to generate content. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleGenerate();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-purple-100">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-400 rounded-full animate-spin animate-reverse"></div>
                    </div>
                </div>
                <div className="mt-6 text-xl font-semibold text-purple-700">Generating your docs...</div>
                <p className="text-slate-500 mt-2">Crafting professional documentation for <span className="font-medium text-purple-600">{topic}</span></p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 font-sans px-4">
            <div className="w-full max-w-2xl mx-auto text-center py-16">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                    <GenerateIcon />
                    AI-Powered Documentation
                </div>

                {/* Header */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 leading-tight">
                    What do you want to<br />
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">learn today?</span>
                </h1>
                <p className="text-slate-500 mb-10 text-lg">
                    Enter any language, framework, or concept — get professional docs in plain English.
                </p>

                {/* Search Bar */}
                <div className="relative mb-8 shadow-lg rounded-full">
                    <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g. React hooks, Python async, JWT auth..."
                        className="w-full h-16 pl-14 pr-[160px] text-base bg-white/90 backdrop-blur-sm rounded-full border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center gap-2 h-12 px-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full text-sm shadow-md transition-all hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <GenerateIcon />
                        <span className="hidden sm:inline">Generate Docs</span>
                        <span className="sm:hidden">Go</span>
                    </button>
                </div>

                {/* Format Cards */}
                <div>
                    <h2 className="text-base font-semibold text-slate-600 mb-4 uppercase tracking-wider">
                        Choose Learning Format
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-md mx-auto">
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

                {/* Popular Topics */}
                <div className="mt-10">
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Popular topics</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {['React', 'Node.js', 'Python', 'TypeScript', 'SQL', 'Docker', 'JWT', 'Async/Await'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTopic(t)}
                                className="px-3 py-1.5 bg-white/70 hover:bg-purple-50 text-slate-600 hover:text-purple-700 border border-slate-200 hover:border-purple-300 rounded-full text-sm transition-all"
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MicroLearning;
