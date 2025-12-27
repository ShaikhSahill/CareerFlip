import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, Clock, Award, AlertCircle, BookOpen, ChevronRight, Youtube, ExternalLink } from 'lucide-react';

const CareerSwapResult = ({ result }) => {
    if (!result) return null;

    const {
        currentCareer,
        targetCareer,
        transferableSkills = [],
        skillsToDevelop = [],
        summaryMetrics = {}
    } = result;

    const {
        yourResumeRating,
        totalEstimatedTimeInMonths,
        potentialSalaryIncreaseIndianRupees,
        commitmentLevel
    } = summaryMetrics;

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header / Transition Overview */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <h2 className="text-white/80 uppercase tracking-widest text-xs font-bold mb-6 text-center">Your Transition Roadmap</h2>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 relative z-10">
                    <div className="text-center">
                        <div className="bg-white/20 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-xl font-bold text-xl md:text-2xl shadow-lg">
                            {currentCareer}
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-1 backdrop-blur-sm">
                            <ArrowRight className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="bg-white text-violet-700 px-6 py-3 rounded-xl font-bold text-xl md:text-2xl shadow-lg shadow-black/10">
                            {targetCareer}
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric Card 1 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                            <Award className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">Score</span>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Resume Fit</p>
                    <div className="flex items-end gap-1">
                        <p className="text-3xl font-extrabold text-slate-800">{yourResumeRating}</p>
                        <p className="text-sm font-bold text-slate-400 mb-1.5">/10</p>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                            style={{ width: `${(yourResumeRating / 10) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Metric Card 2 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Estimated Timeline</p>
                    <p className="text-2xl font-extrabold text-slate-800 leading-tight">{totalEstimatedTimeInMonths}</p>
                    <p className="text-xs text-slate-400 mt-1">Based on current skills</p>
                </div>

                {/* Metric Card 3 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg">+ Salary</span>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Potential Salary Bump</p>
                    <p className="text-2xl font-extrabold text-emerald-700">{potentialSalaryIncreaseIndianRupees}</p>
                    <p className="text-xs text-slate-400 mt-1">Average market increase</p>
                </div>

                {/* Metric Card 4 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Commitment Level</p>
                    <p className={`text-2xl font-extrabold ${commitmentLevel === 'High' ? 'text-amber-600' :
                        commitmentLevel === 'Medium' ? 'text-yellow-600' : 'text-emerald-600'
                        }`}>{commitmentLevel}</p>
                    <div className="flex gap-1 mt-2">
                        {[1, 2, 3].map((lvl) => (
                            <div
                                key={lvl}
                                className={`h-1.5 flex-1 rounded-full ${(commitmentLevel === 'High' && lvl <= 3) ||
                                    (commitmentLevel === 'Medium' && lvl <= 2) ||
                                    (commitmentLevel === 'Low' && lvl <= 1)
                                    ? 'bg-amber-500'
                                    : 'bg-slate-100'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Transferable Skills */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                            <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            Transferable Skills
                        </h3>
                        <span className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">
                            {transferableSkills.length} Found
                        </span>
                    </div>
                    <div className="p-6 space-y-5 flex-1">
                        {transferableSkills.map((item, idx) => (
                            <div key={idx} className="group">
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="font-bold text-slate-700 group-hover:text-violet-600 transition-colors">{item.skill}</span>
                                    <span className="font-bold text-slate-500">{item.relevanceScore}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-1000 ease-out group-hover:shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                                        style={{ width: `${item.relevanceScore}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {transferableSkills.length === 0 && (
                            <div className="text-center py-10 text-slate-400 italic">
                                No directly transferable skills found. Focus on the skills below!
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills to Develop */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                            <div className="p-1.5 bg-violet-100 text-violet-600 rounded-lg">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            Skills to Develop
                        </h3>
                        <span className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">
                            {skillsToDevelop.length} Recommended
                        </span>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {skillsToDevelop.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-violet-200 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                                            {idx + 1}
                                        </div>
                                        <span className="font-bold text-slate-700 group-hover:text-violet-700 transition-colors">{item.skill}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-md border border-violet-100">
                                            {item.estimatedTimeToLearnInMonths} months
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-violet-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {skillsToDevelop.length === 0 && (
                            <div className="text-center py-10 text-slate-400 italic">
                                You are already well-prepared! Go apply now!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* YouTube Recommendations Section */}
            {summaryMetrics.recommendedVideos && summaryMetrics.recommendedVideos.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-red-50 to-pink-50 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                            <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                                <Youtube className="w-5 h-5" />
                            </div>
                            Recommended Learning Resources
                        </h3>
                        <span className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-md">
                            {summaryMetrics.recommendedVideos.length} Videos
                        </span>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {summaryMetrics.recommendedVideos.map((video, idx) => (
                                <a
                                    key={idx}
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-red-300 transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative overflow-hidden bg-slate-100 aspect-video">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
                                                <Youtube className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        {/* Type Badge */}
                                        <div className="absolute top-2 right-2">
                                            <span className="bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                                                {video.type === 'playlist' ? 'Playlist' : 'Video'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h4 className="font-bold text-slate-800 text-sm line-clamp-2 mb-2 group-hover:text-red-600 transition-colors">
                                            {video.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                                            <Youtube className="w-3 h-3" />
                                            {video.channel}
                                        </p>

                                        {/* Learning Path */}
                                        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 rounded-lg p-3 mb-3">
                                            <p className="text-xs text-slate-600 italic leading-relaxed">
                                                💡 {video.learningPath}
                                            </p>
                                        </div>

                                        {/* Watch Button */}
                                        <div className="flex items-center justify-between text-xs font-bold text-red-600 group-hover:text-red-700">
                                            <span>Watch Now</span>
                                            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CareerSwapResult;
