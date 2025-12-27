import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Cpu, Palette, Rocket, Gamepad2 } from 'lucide-react';

// --- Constants ---
// --- Constants ---
const INITIAL_COMMUNITIES = [
    { id: 'tech', name: 'Technology', icon: Cpu, color: 'bg-blue-500', members: '1.2m', desc: 'The premier community for developers to share problems, solutions, and code snippets.' },
    { id: 'design', name: 'Design', icon: Palette, color: 'bg-purple-500', members: '850k', desc: 'A place for UI/UX designers and artists to showcase work and critique.' },
    { id: 'startup', name: 'Startups', icon: Rocket, color: 'bg-orange-500', members: '2.4m', desc: 'Discuss business ideas, growth hacking, and venture capital.' },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2, color: 'bg-emerald-500', members: '5.6m', desc: 'News, reviews, and community for all types of gaming enthusiasts.' }
];

const SUGGESTED_DATA = [
    { id: 'datascience', name: 'Data Science', icon: Cpu, color: 'bg-green-500', members: '600k', desc: 'Big Data, AI, and Machine Learning discussions.' },
    { id: 'mobile', name: 'Mobile Dev', icon: Gamepad2, color: 'bg-indigo-500', members: '450k', desc: 'iOS, Android, React Native, and Flutter.' },
    { id: 'cloud', name: 'Cloud Computing', icon: Rocket, color: 'bg-sky-500', members: '900k', desc: 'AWS, Azure, GCP and serverless architectures.' }
];



// --- Mock AI Function (Simulates the missing callGemini) ---
export const callGemini = async (prompt, systemPrompt) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple logic to return mock responses based on input to make it feel real
    const promptLower = prompt.toLowerCase();

    if (promptLower.includes('refine this post') || promptLower.includes('json')) {
        return JSON.stringify({
            refinedTitle: "Refined: " + prompt.split('\n')[0].replace('Current Title: ', ''),
            refinedContent: "Here is a clearer, more professional version of your content: " + prompt.split('\n')[1].replace('Current Description: ', '')
        });
    }

    if (promptLower.includes('solution')) {
        return "Based on the details provided, the best approach would be to ensure you are checking the console for errors and verifying your API endpoints. Consider using a try-catch block to handle the exception gracefully.";
    }

    if (promptLower.includes('summarize')) {
        return "• Community is active and discussing recent updates.\n• Several users shared helpful resources.\n• Setup questions are being answered by moderators.";
    }

    if (promptLower.includes('hint')) {
        return "Think about the properties of the data structure. You might need to swap the left and right children recursively.";
    }

    return "AI response generated successfully.";
};

const CommunityContext = createContext();

export const useCommunity = () => useContext(CommunityContext);

export const CommunityProvider = ({ children }) => {
    const [myCommunities, setMyCommunities] = useState(INITIAL_COMMUNITIES);
    const [suggestedCommunities, setSuggestedCommunities] = useState(SUGGESTED_DATA);
    const [currentCommunityId, setCurrentCommunityId] = useState('tech');
    const [view, setView] = useState('feed');

    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [toast, setToast] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [aiModal, setAiModal] = useState({ isOpen: false, content: '', title: '' });

    const [posts, setPosts] = useState([
        {
            id: 1, communityId: 'tech', author: 'AlexRiver', time: '2h ago',
            title: "Next.js 14 Hydration Mismatch with Styled Components",
            content: "Has anyone managed to solve the React hydration mismatch error with Next.js 14 when using styled-components? I followed the docs but it still flickers.",
            votes: 421, likes: 421, tag: 'Problem', aiSolution: null, replies: []
        },
        {
            id: 2, communityId: 'tech', author: 'CodeWizard', time: '5h ago',
            title: "Best practice for handling API errors in TypeScript?",
            content: "Looking for a clean global interceptor pattern for production apps.",
            votes: 85, likes: 85, tag: 'Question', aiSolution: null, replies: []
        },
        // --- New Mock Data for Filters ---
        {
            id: 3, communityId: 'tech', author: 'Me', time: '1d ago',
            title: "Why is my useEffect running twice?",
            content: "I know about Strict Mode, but even in production build I see double logs. What am I missing?",
            votes: 12, likes: 12, tag: 'Problem', aiSolution: null, replies: [{ id: 1, author: 'DevGuru', content: 'Check your index.js' }]
        },
        {
            id: 4, communityId: 'tech', author: 'CloudNinja', time: '3h ago',
            title: "AWS Lambda Cold Starts are killing my app",
            content: "Any tips to reduce cold start times for Java runtimes? Or should I just switch to Node?",
            votes: 150, likes: 150, tag: 'Discussion', aiSolution: null, replies: [{ id: 1, author: 'ServerlessFan', content: 'Use SnapStart!' }]
        },
        {
            id: 5, communityId: 'tech', author: 'NewbieDev', time: '30m ago',
            title: "CSS Grid vs Flexbox for this layout?",
            content: "I want to build a masonry layout. Which one is better supported?",
            votes: 5, likes: 5, tag: 'Question', aiSolution: null, replies: []
        }
    ]);

    const [chatMessages, setChatMessages] = useState({
        'tech': [
            { id: 1, author: 'System', content: 'Welcome to the Technology chat!', time: '12:00 PM', isSystem: true },
            { id: 2, author: 'Sarah', content: 'Is the new M3 chip worth the upgrade?', time: '12:05 PM' }
        ],
        'design': [{ id: 1, author: 'System', content: 'Welcome to the Design chat!', time: '12:00 PM', isSystem: true }],
        'startup': [{ id: 1, author: 'System', content: 'Welcome to the Startups chat!', time: '12:00 PM', isSystem: true }],
        'gaming': [{ id: 1, author: 'System', content: 'Welcome to the Gaming chat!', time: '12:00 PM', isSystem: true }]
    });





    // Computed props
    const activeCommunity = myCommunities.find(c => c.id === currentCommunityId) || myCommunities[0];

    const filteredPosts = posts
        .filter(p => p.communityId === currentCommunityId)
        .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.content.toLowerCase().includes(searchQuery.toLowerCase()));



    // Actions
    const showToast = (message, type = 'ai') => setToast({ message, type });
    const closeToast = () => setToast(null);

    const handleCreatePost = (title, content, image) => {
        const newPost = {
            id: Date.now(),
            communityId: currentCommunityId,
            author: 'Me',
            time: 'Just now',
            title,
            content,
            image,
            votes: 1,
            tag: 'Problem',
            aiSolution: null,
            replies: []
        };
        setPosts([newPost, ...posts]);
        setIsPostModalOpen(false);
        showToast("Problem successfully posted!", "success");
    };

    const handleAiSolve = (postId, solution) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, aiSolution: solution } : p));
    };

    const handleSendMessage = (val) => {
        if (!val) return;
        const newMsg = {
            id: Date.now(),
            author: 'Me',
            content: val,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages({
            ...chatMessages,
            [currentCommunityId]: [...(chatMessages[currentCommunityId] || []), newMsg]
        });
    };

    const summarizeChat = async () => {
        const messages = chatMessages[currentCommunityId] || [];
        if (messages.length < 2) return showToast("Not enough context.");

        setAiModal({ isOpen: true, content: 'Reading community chatter...', title: `Summary: #${currentCommunityId}` });
        try {
            // Simulate chat history string
            const history = messages.filter(m => !m.isSystem).map(m => `${m.author}: ${m.content}`).join('\n');
            const summary = await callGemini(`Summarize this chat history into 3 concise bullet points:\n\n${history}`, "You are a helpful community manager.");
            setAiModal(prev => ({ ...prev, content: summary }));
        } catch (err) {
            setAiModal(prev => ({ ...prev, content: 'Failed to generate summary.' }));
        }
    };



    const joinCommunity = (community) => {
        setMyCommunities([...myCommunities, community]);
        setSuggestedCommunities(suggestedCommunities.filter(c => c.id !== community.id));
        showToast(`Joined ${community.name}!`, 'success');
    };


    const value = {
        myCommunities,
        suggestedCommunities,
        joinCommunity,

        currentCommunityId, setCurrentCommunityId,
        view, setView,

        isPostModalOpen, setIsPostModalOpen,
        toast, showToast, closeToast,
        searchQuery, setSearchQuery,
        aiModal, setAiModal,
        posts, filteredPosts,
        chatMessages,

        activeCommunity,
        handleCreatePost,
        handleAiSolve,
        handleSendMessage,
        summarizeChat,

    };

    return (
        <CommunityContext.Provider value={value}>
            {children}
        </CommunityContext.Provider>
    );
};
