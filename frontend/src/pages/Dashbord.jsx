import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRightLeft,
    Map,
    BookOpen,
    Users,
    ArrowRight,
    Sparkles,
    Zap,
    Target
} from 'lucide-react';
import axios from 'axios';

const ServiceCard = ({ title, description, icon: Icon, color, path, delay }) => {
    const navigate = useNavigate();

    return (
        <div
            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer border border-gray-100"
            onClick={() => navigate(path)}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full transition-transform duration-500 group-hover:scale-150 opacity-10 ${color}`}></div>

            <div className="relative z-10">
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${color} bg-opacity-10 text-white shadow-sm`}>
                    <Icon className={`h-6 w-6 text-gray-800`} style={{ color: 'inherit' }} />
                </div>

                <h3 className="mb-2 text-xl font-bold text-gray-900">{title}</h3>
                <p className="mb-6 text-sm text-gray-500 leading-relaxed">
                    {description}
                </p>

                <div className="flex items-center text-sm font-semibold transition-colors group-hover:text-violet-600">
                    <span className="mr-2">Explore Now</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ label, value, icon: Icon, trend }) => (
    <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
            {trend && <p className="text-xs text-green-500 font-medium mt-1">{trend}</p>}
        </div>
        <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
            <Icon className="h-5 w-5" />
        </div>
    </div>
);

const Dashbord = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Check for token in URL query params if redirected from Google Auth
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get('token');

                if (token) {
                    // If token is found in URL, save it to cookies/local storage if not handled by backend cookies
                    // But since we are using HttpOnly/Standard cookies from backend, we just rely on that or existing flow.
                    // For this specific request, we just need to ensure we call the API.
                }

                const response = await axios.get('https://careerflip.onrender.com/api/user/getuser', {
                    withCredentials: true // IMPORTANT: This sends the HttpOnly cookie to the backend
                });
                console.log(response.data);
                setUsername(response.data.username);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, []);

    const services = [
        {
            title: 'Career Swap',
            description: 'Analyze your current skills and get a tailored path to switch your career seamlessly.',
            icon: ArrowRightLeft,
            color: 'bg-blue-500 text-blue-600',
            path: '/careerswap',
            delay: 100
        },
        {
            title: 'AI Roadmap',
            description: 'Generate personalized learning roadmaps powered by AI to master new technologies.',
            icon: Map,
            color: 'bg-purple-500 text-purple-600',
            path: '/roadmap',
            delay: 200
        },
        {
            title: 'Micro-Learning',
            description: 'Consume bite-sized educational content designed for quick and effective learning.',
            icon: Zap,
            color: 'bg-yellow-500 text-yellow-600',
            path: '/microlearning',
            delay: 300
        },
        {
            title: 'Community',
            description: 'Connect with peers, mentors, and industry experts to grow your professional network.',
            icon: Users,
            color: 'bg-pink-500 text-pink-600',
            path: '/community',
            delay: 400
        }
    ];

    return (
        <div className="min-h-full space-y-8 animate-fade-in p-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">{username || 'Explorer'}!</span>
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Ready to take the next big step in your career journey today?
                    </p>
                </div>

                {/* <div className="flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-700 rounded-lg border border-violet-100">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-medium">Pro Member</span>
                </div> */}
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <MetricCard label="Courses In Progress" value="3" icon={BookOpen} trend="+1 this week" />
                <MetricCard label="Skills Mastered" value="12" icon={Target} trend="+2 new" />
                <MetricCard label="Learning Streak" value="5 Days" icon={Zap} trend="Keep it up!" />
            </div>

            {/* Main Services Grid */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Explore Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard key={service.title} {...service} />
                    ))}
                </div>
            </div>

            {/* Recent Activity / Banner (Optional) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white shadow-lg">
                <div className="relative z-10 max-w-2xl">
                    <h3 className="text-2xl font-bold mb-2">Join the Weekly AI Challenge</h3>
                    <p className="text-gray-300 mb-6">Test your skills against the community and win exclusive badges.</p>
                    <button className="px-6 py-2.5 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        View Challenge
                    </button>
                </div>
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white opacity-5"></div>
                <div className="absolute bottom-0 right-20 -mb-10 h-32 w-32 rounded-full bg-violet-500 opacity-20 blur-xl"></div>
            </div>
        </div>
    );
};

export default Dashbord;