import React, { useEffect } from 'react';
import { Sparkles, Check } from 'lucide-react';

const CommunityToast = ({ message, type = 'ai', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-6 right-6 z-[200] animate-bounce-in bg-slate-800 text-white px-4 py-2 rounded shadow-xl text-xs flex items-center gap-2">
            {type === 'ai' ? <Sparkles className="w-3 h-3 text-blue-400" /> : <Check className="w-3 h-3 text-green-400" />}
            {message}
        </div>
    );
};

export default CommunityToast;
