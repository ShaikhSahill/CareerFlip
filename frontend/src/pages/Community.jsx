import React from 'react';
import { CommunityProvider, useCommunity } from '../context/CommunityContext';
import FeedView from '../components/community/FeedView';
import ChatView from '../components/community/ChatView';
import MyCommunities from '../components/community/MyCommunities';

import PostModal from '../components/community/PostModal';
import AiModal from '../components/community/AiModal';
import CommunityToast from '../components/community/CommunityToast';

const CommunityHeader = () => {
    const { view, setView } = useCommunity();

    return (
        <header className="h-12 bg-white border-b border-slate-200 flex items-center px-6 shrink-0 gap-8 ">
            <div className="h-full flex gap-6">
                <button
                    onClick={() => setView('feed')}
                    className={`text-xs font-bold h-full px-2 transition-all ${view === 'feed' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}
                >
                    Posts
                </button>
                <button
                    onClick={() => setView('chat')}
                    className={`text-xs font-bold h-full px-2 transition-all ${view === 'chat' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}
                >
                    Community Chat
                </button>

            </div>
        </header>
    );
};

const CommunityContent = () => {
    const { view, toast, closeToast } = useCommunity();

    return (
        <div className="h-screen overflow-y-auto  flex flex-col overflow-hidden font-inter text-slate-900 bg-slate-100">
            <CommunityHeader />

            {/* Main Container */}
            <div className="flex-1 flex overflow-hidden">
                <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-100 min-w-0">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {view === 'feed' ? (
                            <FeedView />
                        ) : (
                            <ChatView />
                        )}
                    </div>
                </main>
                <MyCommunities />
            </div>

            {/* Modals & Toasts */}
            <PostModal />
            <AiModal />

            {toast && <CommunityToast message={toast.message} type={toast.type} onClose={closeToast} />}
        </div>
    );
};

export default function Community() {
    return (
        <CommunityProvider>
            <CommunityContent />
        </CommunityProvider>
    );
}