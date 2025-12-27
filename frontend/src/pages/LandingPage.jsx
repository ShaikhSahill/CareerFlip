import React from 'react';
import Hyperspeed from '../components/Hyperspeed.jsx';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/register');
    }


    // Light theme options for the Hyperspeed component with user's adjustments
    const lightThemeEffectOptions = {
        onSpeedUp: () => { },
        onSlowDown: () => { },
        distortion: 'turbulentDistortion',
        length: 400,
        roadWidth: 18,
        islandWidth: 6,
        lanesPerRoad: 3,
        fov: 80,
        fovSpeedUp: 130,
        speedUp: 4,
        carLightsFade: 0.4,
        totalSideLightSticks: 25,
        lightPairsPerRoadWay: 50,
        shoulderLinesWidthPercentage: 0.05,
        brokenLinesWidthPercentage: 0.1,
        brokenLinesLengthPercentage: 0.5,
        lightStickWidth: [0.1, 0.4],
        lightStickHeight: [1.2, 1.6],
        movingAwaySpeed: [80, 100],
        movingCloserSpeed: [-140, -180],
        carLightsLength: [400 * 0.02, 400 * 0.15],
        carLightsRadius: [0.03, 0.1],
        carWidthPercentage: [0.3, 0.5],
        carShiftX: [-0.7, 0.7],
        carFloorSeparation: [0, 5],
        colors: {
            roadColor: 0xe5e7eb,
            islandColor: 0xd1d5db,
            background: 0xf9fafb,
            shoulderLines: 0x6b7280,
            brokenLines: 0x9ca3af,
            leftCars: [0xef4444, 0xf97316, 0xd946ef],
            rightCars: [0x10b981, 0x3b82f6, 0x8b5cf6],
            sticks: 0x0ea5e9,
        }
    };

    // Data for the feature cards
    const features = [
        {
            bgColor: "bg-orange-500",
            icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0-1V4m0 2.01V5M12 20v-1m0-1v-1m0-1V4m0 16v-1m0-1v-1m0-1v-1m0-1v-1m0-1v-1m0-1v-1m0-1v-1m0-1v-1m0-1v-1m0-1v-1m0-1v-1M6 9.01V9M6 15v-.01M18 9.01V9m0 6v-.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
            title: "Career Swap",
            description: "Seamlessly transition between career paths with AI-guided pivot strategies."
        },
        {
            bgColor: "bg-indigo-500",
            icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>,
            title: "Smart Roadmap",
            description: "AI creates personalized career paths based on your goals, skills, and industry trends."
        },
        {
            bgColor: "bg-pink-500",
            icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
            title: "Adaptive Timetable",
            description: "Dynamic scheduling that adapts to your lifestyle and learning pace."
        },
        {
            bgColor: "bg-emerald-500",
            icon: <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>,
            title: "Community",
            description: "Connect with students, mentors, and industry experts to share insights and grow together."
        },
    ];

    return (
        <div className="relative w-screen h-screen overflow-y-auto bg-gray-50">
            {/* Background Layer: Stays fixed during scroll for a parallax-like effect. */}
            <div className="fixed top-0 left-0 w-full h-full z-0 opacity-100">
                <Hyperspeed effectOptions={lightThemeEffectOptions} />
            </div>

            {/* Header for top-right navigation */}
            {/* <header className="absolute top-0 left-0 w-full p-4 sm:p-6 md:p-8 z-20 flex justify-end">
                <button
                    onClick={handleAuthRedirect}
                    className="
                        inline-flex items-center gap-1 px-4 py-2 text-lg font-semibold text-white 
                                bg-gradient-to-r from-blue-500 to-purple-600 
                                rounded-full shadow-lg 
                                transform transition-all duration-300 ease-in-out 
                                hover:scale-105 hover:shadow-2xl
                                active:scale-100
                                cursor-pointer
                                focus:outline-none focus:ring-4 focus:ring-blue-300
                    "
                >
                    Login / Sign Up
                </button>
            </header> */}

            {/* Main content container with responsive padding */}
            <main className="relative z-10 min-h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl">
                    {/* Left Column: Text content and button */}
                    <div className="md:w-1/2 lg:w-5/12 text-center md:text-left mb-12 md:mb-0">
                        {/* Responsive heading */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold text-gray-800 mb-6 leading-tight">
                            Plan.
                            <br />
                            Learn.
                            <br />
                            Grow.
                            <br />
                            With AI.
                        </h1>
                        <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto md:mx-0">
                            Your AI-powered career mentor that creates personalized learning paths, tracks progress, and guides Gen Z learners to their dream careers.
                        </p>
                        <button
                            onClick={handleRedirect}
                            className="
                                inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white 
                                bg-linear-to-r from-blue-500 to-purple-600 
                                rounded-full shadow-lg 
                                transform transition-all duration-300 ease-in-out 
                                hover:scale-105 hover:shadow-2xl
                                active:scale-100
                                cursor-pointer
                                focus:outline-none focus:ring-4 focus:ring-blue-300
                            "
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            Start My Journey
                        </button>
                    </div>

                    {/* Right Column: Feature cards with responsive gap */}
                    <div className="w-full md:w-1/2 lg:w-6/12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-10">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg text-left flex flex-col items-start transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                                    <div className={`p-3 rounded-lg ${feature.bgColor} mb-4`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default LandingPage;