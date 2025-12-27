import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// --- SVG Icon Components ---
// All necessary icons are included here for a single-file solution.

const LogoIcon = () => (
    <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="url(#paint0_linear_layout)" />
        <path d="M20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10C14.4772 10 10 14.4772 10 20C10 25.5228 14.4772 30 20 30Z" stroke="white" strokeWidth="2" />
        <path d="M23 17L17 23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 17H23V23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
            <linearGradient id="paint0_linear_layout" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" /><stop offset="1" stopColor="#A855F7" />
            </linearGradient>
        </defs>
    </svg>
);

const MenuIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const BellIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

// Sidebar Icons
const DashboardIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const RoadmapIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const MicroLearningIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18" /></svg>;
const CommunityIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const CareerSwapIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;
const SettingsIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UserCircleIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16.5c2.57 0 4.98.655 7.099 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

// --- NEW ICONS ---
const UsersIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-1.781-4.121M12 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" /></svg>;
const BriefcaseIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;


// --- Navigation Components ---

const navLinks = [
    { name: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
    { name: 'Career Swap', icon: CareerSwapIcon, path: '/careerswap' },
    { name: 'Roadmap', icon: RoadmapIcon, path: '/roadmap' },
    { name: 'Micro-Learning', icon: MicroLearningIcon, path: '/microlearning' }, 
    { name: 'Community', icon: CommunityIcon, path: '/community' }
];

const Sidebar = ({ isOpen }) => {
    const baseLinkClass = "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors";
    const activeLinkClass = "bg-violet-100 text-violet-700";
    const inactiveLinkClass = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";

    return (
        <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col`}>
            {/* Sidebar Header */}
            <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-200 shrink-0">
                <LogoIcon />
                <span className="font-bold text-xl text-gray-800">NxtGenThinkers</span>
            </div>

            {/* Navigation Links */}
            <div className="grow p-4 overflow-y-auto">
                <nav className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                        <NavLink key={link.name} to={link.path} className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                            <link.icon className="h-5 w-5" />
                            <span>{link.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200 shrink-0">
                <NavLink to="/settings" className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                    <SettingsIcon className="h-5 w-5" />
                    <span>Settings</span>
                </NavLink>
            </div>
        </aside>
    );
};

const pageTitles = {
    '/dashboard': 'Dashboard',
    '/roadmap': 'Roadmap',
    '/roadmapflow': 'RoadmapFlow',
    '/microlearning': 'Micro-Learning',
    '/mirolearning/generate': 'Generate Content',
    '/peer-connection': 'PeertoPeer', // New Title
    '/job-recommendation': 'JobRecommendation', // New Title
    '/community': 'Community',
    '/careerswap': 'Career Swap',
    '/analysis': 'Swap Analysis',
    '/settings': 'Settings',
};

const TopNav = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const title = pageTitles[location.pathname] || '';
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);

    const handleLogout = () => {
        // Implement logout logic here (e.g., clear auth tokens, redirect to login page)
        localStorage.removeItem('token');
        // remove cookies
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';

        navigate('/login');
    }

    // Close the profile menu if clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white border-b border-gray-200 h-16 shrink-0">
            <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <button onClick={toggleSidebar} className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100" aria-label="Open sidebar">
                        <MenuIcon className="h-6 w-6" />
                    </button>
                    <h1 className="text-lg font-medium text-gray-700 ml-4">
                        {title}
                    </h1>
                </div>

                <div className="flex items-center space-x-4">
                    {/* <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700" aria-label="View notifications">
                        <BellIcon className="h-6 w-6" />
                    </button> */}

                    <div className="relative" ref={profileMenuRef}>
                        <button onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center" aria-label="User menu" aria-haspopup="true">
                            <img
                                className="h-9 w-9 rounded-full object-cover border-2 border-transparent hover:border-violet-500"
                                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib-rb-1.2.1&auto=format&fit=crop&w=880&q=80"
                                alt="User avatar"
                            />
                        </button>

                        {isProfileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-xl py-1 ring-1 ring-black ring-opacity-5 z-20">
                                {/* <div className="px-4 py-3 border-b border-gray-200">
                                    <p className="text-sm font-semibold text-gray-900">Emily Carter</p>
                                    <p className="text-xs text-gray-500 truncate">emily.carter@example.com</p>
                                </div> */}
                                <div className="py-1">
                                    {/* <Link 
                                        to="/profile" 
                                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 transition-colors" 
                                        role="menuitem"
                                        onClick={() => setProfileMenuOpen(false)}
                                    >
                                        <UserCircleIcon className="w-5 h-5 text-gray-400" />
                                        <span>Edit Profile</span>
                                    </Link> */}
                                    <button

                                        className="w-full flex items-center gap-3 text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:font-medium transition-all"
                                        role="menuitem"
                                        onClick={handleLogout}
                                        // onClick={() => setProfileMenuOpen(false)}
                                    >
                                        <LogoutIcon className="w-5 h-5" />
                                        <span >Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};


// --- Main Layout Component (Default Export) ---

const Navbar = ({ children }) => {

    // State to manage the sidebar's visibility
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} />

            <div className="flex-1 flex flex-col ">
                <TopNav toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>

            </div>

            {/* Overlay for mobile view when sidebar is open */}
            {isSidebarOpen && (
                <div
                    onClick={toggleSidebar}
                    className="fixed inset-0 bg-transparent bg-opacity-50 z-20 md:hidden"
                    aria-hidden="true"
                ></div>
            )}
        </div>
    );
};

export default Navbar;