import React from 'react';
import { Sparkles } from 'lucide-react';
import { useCommunity } from '../../context/CommunityContext';

const AiModal = () => {
    const { aiModal, setAiModal } = useCommunity();

    if (!aiModal.isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden p-6 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Sparkles className="w-6 h-6" /></div>
                    <div>
                        <h3 className="font-bold text-slate-800">{aiModal.title}</h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Powered by Gemini AI</p>
                    </div>
                </div>
                <div className="text-sm text-slate-600 leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar p-3 bg-slate-50 rounded-lg border border-slate-100 whitespace-pre-wrap">
                    {aiModal.content}
                </div>
                <div className="flex justify-end pt-2">
                    <button onClick={() => setAiModal({ ...aiModal, isOpen: false })} className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold text-sm hover:bg-black transition-all">Close</button>
                </div>
            </div>
        </div>
    );
};

export default AiModal;
