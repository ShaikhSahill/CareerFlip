import React, { useState } from 'react';
import aiImage from '../assets/aiChatbot.jpg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../components/Toast';




// --- SVG Icon Components (for better readability) ---

const LogoIcon = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="url(#paint0_linear_1_2)" />
        <path d="M20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10C14.4772 10 10 14.4772 10 20C10 25.5228 14.4772 30 20 30Z" stroke="white" strokeWidth="2" />
        <path d="M23 17L17 23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 17H23V23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
            <linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#A855F7" />
            </linearGradient>
        </defs>
    </svg>
);

const EyeOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeClosedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.007 10.007 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.007 10.007 0 01-2.293 4.233" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C44.438 36.372 48 30.656 48 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);


const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { showToast } = useToast();

    const navigate = useNavigate();

    // Normal email/password registration
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://careerflip.onrender.com/api/user/register', {
                email,
                username,
                password
            }, { withCredentials: true });
            showToast(res.data.error || 'Registration successful');
            if (res.status === 201) {
                navigate('/login');
            }


        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.error || 'Error registering user');
        }
    };

    // Google login / signup (auto password handling)
     const handleGoogleLogin = () => {
        window.location.href = 'https://careerflip.onrender.com/api/user/auth/google';
    };

    return (
        <div className="max-h-screen flex items-center justify-center p-4 overflow-y-hidden  ">
            <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl w-full mx-auto  rounded-3xl shadow-xl overflow-hidden">

                {/* Left Section */}
                <div className="hidden md:flex flex-col justify-center p-12 space-y-8 ">
                    <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Career Mentor</span>
                        <br />
                        Platform
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Unlock the future of education with AI-powered courses designed to accelerate your learning journey.
                    </p>
                    <img src={aiImage} alt="AI Illustration" className="w-full h-auto object-cover rounded-xl" />
                </div>

                {/* Right Section */}
                <div className="w-full p-8 sm:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-gray-900">Join Us Today!</h2>
                    <p className="text-gray-500 mt-2 mb-6">Create your account for an enhanced experience.</p>

                    {/* Registration Form */}
                    <form className="space-y-4" onSubmit={handleRegister}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email here"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Choose a Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username here"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Create a Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                                </button>
                            </div>
                        </div>

                        <div className="text-xs text-gray-500 flex items-center gap-1.5">
                            <LockIcon />
                            Minimum 8 characters required
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-cyan-400 to-green-400 text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity duration-200"
                        >
                            Sign Up
                        </button>
                    </form>

                    <div className="mt-6 space-y-3">
                        <button
                            onClick={handleGoogleLogin}
                            type="button"
                            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <GoogleIcon />
                            <span className="font-medium text-gray-700">Sign in with Google</span>
                        </button>
                    </div>

                    {message && <p className="text-center mt-4 text-sm text-green-600">{message}</p>}

                    <p className="text-center text-sm text-gray-600 mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-orange-500 hover:underline">
                            Sign In!
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Register;