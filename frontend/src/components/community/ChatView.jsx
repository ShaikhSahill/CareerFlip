import React, { useRef, useEffect } from 'react';
import { PlusSquare, Sparkles, Users, Smile, Send } from 'lucide-react';
import { useCommunity } from '../../context/CommunityContext';

const ChatView = () => {
    const {
        myCommunities,
        currentCommunityId,
        setCurrentCommunityId,
        activeCommunity,
        chatMessages,
        handleSendMessage,
        summarizeChat
    } = useCommunity();

    const chatEndRef = useRef(null);
    const messages = chatMessages[currentCommunityId] || [];

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, currentCommunityId]);

    const onSubmit = (e) => {
        e.preventDefault();
        const input = e.target.elements.message;
        const val = input.value.trim();
        handleSendMessage(val);
        input.value = '';
    };

    return (
        <div className="h-[90%] flex max-w-6xl mx-auto bg-white rounded shadow-sm border border-slate-300 overflow-hidden m-5">
            <div className="w-64 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-sm text-slate-800">Communities</h3>
                    <PlusSquare className="w-5 h-5 text-blue-600 cursor-pointer" />
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {myCommunities.map(comm => (
                        <button
                            key={comm.id}
                            onClick={() => setCurrentCommunityId(comm.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${currentCommunityId === comm.id ? 'bg-blue-50 border-r-4 border-blue-600' : 'text-slate-600 hover:bg-white hover:shadow-sm'}`}
                        >
                            <div className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-lg ${comm.color} text-white`}>
                                <comm.icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 text-left overflow-hidden">
                                <p className="font-bold text-xs text-slate-800 truncate"># {comm.name.toLowerCase()}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 flex flex-col min-w-0 bg-white">
                <div className="h-12 border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-medium">#</span>
                        <span className="font-bold text-sm text-slate-800">{activeCommunity.name.toLowerCase()}</span>
                    </div>
                    {/* <div className="flex items-center gap-3">
                        <button onClick={summarizeChat} className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold hover:bg-blue-100 transition-colors border border-blue-200">
                            <Sparkles className="w-3 h-3" /> ✨ Summarize
                        </button>
                        <Users className="w-4 h-4 text-slate-400 cursor-pointer" />
                    </div> */}
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/30">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.isSystem ? 'justify-center' : (msg.author === 'Me' ? 'justify-end' : 'justify-start')}`}>
                            {msg.isSystem ? (
                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 py-2">{msg.content}</span>
                            ) : (
                                <div className="max-w-[80%]">
                                    <div className={`flex items-center gap-2 mb-0.5 ${msg.author === 'Me' ? 'flex-row-reverse' : ''}`}>
                                        <span className="text-[10px] font-bold text-slate-500">{msg.author}</span>
                                        <span className="text-[8px] text-slate-400">{msg.time}</span>
                                    </div>
                                    <div className={`${msg.author === 'Me' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-800'} px-3 py-2 text-xs rounded shadow-sm`}>
                                        {msg.content}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>
                <div className="p-4 border-t border-slate-100 bg-white">
                    <form onSubmit={onSubmit} className="flex gap-2">
                        <div className="flex-1 relative">
                            <input name="message" type="text" placeholder={`Message #${activeCommunity.name.toLowerCase()}...`} className="w-full bg-slate-50 border border-slate-200 focus:ring-1 focus:ring-blue-500 rounded px-4 py-2 outline-none text-sm pr-10" />
                            <Smile className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer w-4 h-4" />
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-6 rounded font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                            <span className="hidden sm:inline">Send</span>
                            <Send className="w-4 h-4 sm:hidden" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatView;
