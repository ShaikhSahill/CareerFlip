import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, FileText, ArrowRight, Loader2, Sparkles, AlertCircle, X, Repeat, Trash2, ArrowLeftRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import CareerSwapResult from '../components/CareerSwapResult';
import { useToast } from '../components/Toast';
const CareerSwap = () => {
    const { showToast } = useToast();
    const [currentRole, setCurrentRole] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    // Skills state (Visual only for now, as backend processes PDF)
    const [skills, setSkills] = useState(['JavaScript', 'React', 'CSS']);
    const [skillInput, setSkillInput] = useState('');
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
        } else {
            showToast("Please upload a valid PDF file.", "error");
        }
    };
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            if (selectedFile.type === "application/pdf") {
                setFile(selectedFile);
            } else {
                showToast("Please upload a valid PDF file.", "error");
            }
        }
    };
    const handleSkillKeyDown = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!skills.includes(skillInput.trim())) {
                setSkills([...skills, skillInput.trim()]);
            }
            setSkillInput('');
        }
    };
    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };
    const handleReset = () => {
        setCurrentRole('');
        setTargetRole('');
        setFile(null);
        setSkills([]);
        setResult(null);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentRole || !targetRole || !file) {
            showToast("Please fill all fields and upload a resume.", "error");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('currentRole', currentRole);
        formData.append('targetRole', targetRole);
        formData.append('pdfFile', file);
        try {
            const response = await axios.post('https://careerflip.onrender.com/api/careerSwap/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (response.data && response.data.analysisResult) {
                setResult(response.data.analysisResult);
                showToast("Analysis complete!", "success");
            }
        } catch (error) {
            console.error("Analysis failed:", error);
            showToast("Failed to analyze resume. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="max-h-screen bg-slate-50 font-inter text-slate-900 ">
            <div className="max-w-7xl mx-auto p-4">
                {/* Result View */}
                {result ? (
                    <div className="space-y-6">
                        <button
                            onClick={() => setResult(null)}
                            className="flex items-center text-slate-500 hover:text-violet-600 font-medium transition-colors"
                        >
                            <ArrowRight className="w-4 h-4 rotate-180 mr-2" /> Back to Analysis
                        </button>
                        <CareerSwapResult result={result} />
                    </div>
                ) : (
                    // Input View
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Input Column */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Card 1: Carer Transition */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <h2 className="text-lg font-bold text-slate-800 mb-4">Career Transition</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-500">Current Career</label>
                                        <input
                                            type="text"
                                            value={currentRole}
                                            onChange={(e) => setCurrentRole(e.target.value)}
                                            placeholder="Type your current role"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-500">Target Career</label>
                                        <input
                                            type="text"
                                            value={targetRole}
                                            onChange={(e) => setTargetRole(e.target.value)}
                                            placeholder="Type your target role"
                                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Card 2: Current Skills & Resume */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <h2 className="text-lg font-bold text-slate-800 mb-4">Current Skills</h2>
                                {/* Skills Input */}
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 min-h-[100px] flex flex-wrap gap-2 content-start mb-6 focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-violet-500 transition-all">
                                    {skills.map((skill, index) => (
                                        <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-violet-100 text-violet-700">
                                            {skill}
                                            <button onClick={() => removeSkill(skill)} className="ml-1.5 hover:text-violet-900 focus:outline-none">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={handleSkillKeyDown}
                                        placeholder={skills.length === 0 ? "Type skills and press Enter..." : ""}
                                        className="flex-1 bg-transparent border-none outline-none text-sm p-1.5 min-w-[150px] text-slate-800 placeholder:text-slate-400"
                                    />
                                </div>
                                <div className="relative flex items-center justify-center my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-200"></div>
                                    </div>
                                    <span className="relative z-10 px-4 bg-white text-sm text-slate-400 uppercase tracking-widest font-medium">OR</span>
                                </div>
                                {/* Drag & Drop Area */}
                                <div
                                    className={`relative group border-2 border-dashed rounded-xl p-10 transition-all text-center cursor-pointer
                                        ${dragActive ? 'border-violet-500 bg-violet-50' : 'border-slate-300 hover:border-violet-400 hover:bg-slate-50'}`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    {file ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                                <FileText className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-lg mb-1">{file.name}</p>
                                                <p className="text-slate-500 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setFile(null);
                                                }}
                                                className="text-sm font-bold text-red-500 hover:text-red-700 z-20 flex items-center gap-1 mt-2"
                                            >
                                                <Trash2 className="w-4 h-4" /> Remove File
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 py-4">
                                            <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-violet-500 transition-colors" />
                                            <p className="text-slate-600 font-medium">
                                                Drag and drop your resume or <span className="text-violet-600 font-bold">click to browse</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 pt-2">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-violet-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5" /> Simulate Career Switch
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleReset}
                                    disabled={loading}
                                    className="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95"
                                >
                                    Clear & Reset
                                </button>
                            </div>
                        </div>
                        {/* Sidebar Column */}
                        <div className="space-y-6">
                            {/* Helpful Tips Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1 h-6 bg-violet-500 rounded-full"></div>
                                    <h3 className="font-bold text-slate-800">Helpful Tips</h3>
                                </div>
                                <ul className="space-y-4 text-sm text-slate-600 leading-relaxed">
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></span>
                                        <span>Be specific with your current skills - include technical tools, soft skills, and certifications.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></span>
                                        <span>Consider adjacent careers that share similar skill sets for easier transitions.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0"></span>
                                        <span>Upload your resume for more accurate skill extraction and analysis.</span>
                                    </li>
                                </ul>
                            </div>
                            {/* Popular Career Swaps Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <ArrowLeftRight className="w-5 h-5 text-violet-500" />
                                    <h3 className="font-bold text-slate-800">Popular Career Swaps</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 transition-colors hover:border-violet-200 cursor-pointer group">
                                        <div className="flex items-center justify-between text-sm font-bold text-slate-700 group-hover:text-violet-700">
                                            <span>Web Developer</span>
                                            <ArrowRight className="w-4 h-4 text-slate-400" />
                                            <span>UX Designer</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">85% skill overlap</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 transition-colors hover:border-violet-200 cursor-pointer group">
                                        <div className="flex items-center justify-between text-sm font-bold text-slate-700 group-hover:text-violet-700">
                                            <span>Data Analyst</span>
                                            <ArrowRight className="w-4 h-4 text-slate-400" />
                                            <span>Data Scientist</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">78% skill overlap</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 transition-colors hover:border-violet-200 cursor-pointer group">
                                        <div className="flex items-center justify-between text-sm font-bold text-slate-700 group-hover:text-violet-700">
                                            <span>Marketing</span>
                                            <ArrowRight className="w-4 h-4 text-slate-400" />
                                            <span>Product Manager</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">72% skill overlap</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default CareerSwap