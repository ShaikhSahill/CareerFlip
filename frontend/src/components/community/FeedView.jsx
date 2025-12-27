import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useCommunity } from '../../context/CommunityContext';
import PostCard from './PostCard';

const FeedView = () => {
    const {
        activeCommunity,
        filteredPosts,
        searchQuery,
        setSearchQuery,
        setIsPostModalOpen
    } = useCommunity();

    // Filter State
    const [activeFilter, setActiveFilter] = useState('latest'); // latest, unanswered, my_posts, trending

    // Filter Logic
    const displayedPosts = filteredPosts.filter(post => {
        if (activeFilter === 'unanswered') return post.replies.length === 0;
        if (activeFilter === 'my_posts') return post.author === 'Me';
        if (activeFilter === 'trending') return post.likes > 100;
        return true; // 'latest'
    }).sort((a, b) => {
        if (activeFilter === 'trending') return b.likes - a.likes;
        return 0;
    });

    return (
        <div className="max-w-5xl mx-auto m-3">
            {/* Posts Tab Controls: Search and Create */}
            <div className="flex flex-col sm:flex-row gap-3 items-center bg-white p-3 rounded-xl border border-slate-300 shadow-sm mb-2">
                <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder={`Search in r/${activeCommunity.name}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded-lg text-sm outline-none transition-all"
                    />
                </div>
                <button
                    onClick={() => setIsPostModalOpen(true)}
                    className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2"
                >
                    <span>+ Create Post</span>
                </button>

            </div>

            {/* Filter Row */}
            <div className="mb-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">Explore Discussions</h3>
                <div className="flex gap-2 justify-center overflow-x-auto pb-2">
                    {[
                        { id: 'latest', label: 'Latest' },
                        { id: 'unanswered', label: 'Needs Answers' },
                        { id: 'my_posts', label: 'My Questions' },
                        { id: 'trending', label: 'Trending' }
                    ].map(filter => (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`text-sm font-bold px-5 py-2 rounded-full border transition-all whitespace-nowrap ${activeFilter === filter.id
                                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-6">
                <div className="flex-1 space-y-3">
                    {displayedPosts.length > 0 ? (
                        displayedPosts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))
                    ) : (
                        <div className="bg-white p-8 rounded-xl border border-slate-300 text-center">
                            <p className="text-slate-400 text-sm italic">No posts found matching your search.</p>
                        </div>
                    )}
                </div>

            </div>
        </div >
    );
};

export default FeedView;
