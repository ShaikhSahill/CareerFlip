import React, { useState } from 'react';
import aiImage from '../assets/aiChatbot.jpg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../components/Toast';

// --- SVG ICONS ---
const EyeOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeClosedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 0 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a10.007 10.007 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" />
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

const LinkedInIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

// --- MAIN LOGIN COMPONENT ---
const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('https://careerflip.onrender.com/api/user/login', formData);
            showToast(res.data.message || 'Login successful', 'success');

            // Set token in cookie (valid for 1 day)
            document.cookie = `token=${res.data.token}; path=/; max-age=86400; samesite=strict; secure`;
            localStorage.setItem('token', res.data.token);

            navigate('/dashboard');
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Login failed';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAuthProviderLogin = () => {
          window.location.href = 'https://careerflip.onrender.com/api/user/auth/google';

    };

    return (
        <div className="max-h-screen bg-gray-50 flex items-center justify-center p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 max-w-6xl w-full gap-8 mx-auto">

                {/* LEFT */}
                <div className="hidden md:flex flex-col justify-center p-8 text-white rounded-3xl">
                    <h1 className="text-5xl font-extrabold leading-tight tracking-tighter text-black">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                            AI Career Mentor
                        </span>
                        <br /> Platform
                    </h1>
                    <p className="text-gray-600 text-lg max-w-md">
                        Unlock the future of education with AI-powered courses designed to accelerate your learning journey
                    </p>
                    <img src={aiImage} alt="AI Learning" className="w-full h-auto object-cover rounded-xl mt-6" />
                </div>

                {/* RIGHT */}
                <div className="bg-white text-gray-800 p-8 sm:p-12 rounded-3xl shadow-lg w-full max-w-md mx-auto md:max-w-full">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="text-gray-500 mt-2">Access your AI learning Journey</p>
                    </div>

                    <form onSubmit={handleLogin} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter your email"
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
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

                        {/* {error && <p className="text-red-500 text-sm text-center">{error}</p>} */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity"
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>

                    <div className="mt-6 space-y-3">
                        <button
                            onClick={() => handleAuthProviderLogin('google')}
                            type="button"
                            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            <GoogleIcon />
                            <span className="font-medium text-gray-700">Sign in with Google</span>
                        </button>

                        {/* <button
              onClick={() => handleAuthProviderLogin('github')}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <LinkedInIcon />
              <span className="font-medium text-gray-700">Sign in with GitHub</span>
            </button> */}
                    </div>

                    <p className="text-center text-sm text-gray-600 mt-8">
                        Don’t have an account?{' '}
                        <Link to="/register" className="font-medium text-orange-500 hover:underline">
                            Sign Up!
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
