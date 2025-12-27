import React, { useState } from 'react';
import { useCommunity } from '../../context/CommunityContext';
import { Rocket, Gamepad2, Cpu, Palette, Plus, ArrowLeft, Check } from 'lucide-react';

const CommunityCard = ({ community, isSuggested, onJoin, isActive }) => {
    const Icon = community.icon;

    return (
        <div
            className={`flex items-center gap-3 p-3 border rounded-xl shadow-sm cursor-pointer transition-all group relative ${isActive
                ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500/20'
                : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
                }`}
        >
            <div className={`p-2 rounded-lg ${community.color} text-white group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 truncate">{community.name}</h4>
                <p className="text-xs text-slate-500 truncate">{community.members} Members</p>
            </div>
            {!isSuggested && isActive && (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" title="Active" />
            )}

            {isSuggested && (
                <button
                    onClick={(e) => { e.stopPropagation(); onJoin(community); }}
                    className="p-1.5 bg-slate-100 rounded-full hover:bg-green-100 hover:text-green-600 transition-colors"
                    title="Join Community"
                >
                    <Plus className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

const MyCommunities = () => {
    const {
        myCommunities,
        suggestedCommunities,
        joinCommunity,
        setCurrentCommunityId,
        currentCommunityId
    } = useCommunity();

    const [isDiscoverMode, setIsDiscoverMode] = useState(false);

    const displayedCommunities = isDiscoverMode ? suggestedCommunities : myCommunities;

    return (
        <aside className="w-80 shrink-0 hidden lg:flex flex-col gap-6 p-6 h-full overflow-y-auto border-l border-slate-200 bg-white/50 backdrop-blur-sm">

            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {isDiscoverMode && (
                        <button
                            onClick={() => setIsDiscoverMode(false)}
                            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 text-slate-500" />
                        </button>
                    )}
                    <h3 className="font-bold text-slate-800 text-lg">
                        {isDiscoverMode ? 'Discover' : 'My Communities'}
                    </h3>
                </div>
            </div>

            {/* Communities List */}
            <div className="space-y-3">
                {displayedCommunities.length > 0 ? (
                    displayedCommunities.map(community => (
                        <div key={community.id} onClick={() => !isDiscoverMode && setCurrentCommunityId(community.id)}>
                            <CommunityCard
                                community={community}
                                isSuggested={isDiscoverMode}
                                onJoin={joinCommunity}
                                isActive={!isDiscoverMode && currentCommunityId === community.id}
                            />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-slate-400 text-sm">
                        <Check className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p>All communities joined!</p>
                    </div>
                )}
            </div>

            {/* Discover More */}
            {!isDiscoverMode && (
                <div className="pt-4 border-t border-slate-200">
                    <button
                        onClick={() => setIsDiscoverMode(true)}
                        className="w-full py-2.5 border border-dashed border-slate-300 rounded-xl text-slate-500 text-xs font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Discover New
                    </button>
                </div>
            )}

            {/* Mini Footer */}
            <div className="mt-auto pt-6 text-[10px] text-slate-400 text-center leading-relaxed">
                <p>© 2025 NxtGenThinkers</p>
                <div className="flex justify-center gap-2 mt-1">
                    <span className="hover:text-slate-600 cursor-pointer">Privacy</span>
                    <span>•</span>
                    <span className="hover:text-slate-600 cursor-pointer">Terms</span>
                    <span>•</span>
                    <span className="hover:text-slate-600 cursor-pointer">Guidelines</span>
                </div>
            </div>
        </aside>
    );
};

export default MyCommunities;
