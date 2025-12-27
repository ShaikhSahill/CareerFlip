import React, { useState } from 'react';
import { X, Users, Loader2, Wand2, Bold, Italic, Link2 } from 'lucide-react';
import { useCommunity, callGemini } from '../../context/CommunityContext';

const PostModal = () => {
    const {
        isPostModalOpen,
        setIsPostModalOpen,
        activeCommunity,
        handleCreatePost,
        showToast
    } = useCommunity();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [isRefining, setIsRefining] = useState(false);

    if (!isPostModalOpen) return null;

    const onClose = () => setIsPostModalOpen(false);

    const handleRefine = async () => {
        if (!title.trim()) return showToast("Enter a title first!");
        setIsRefining(true);
        // ... (AI logic would go here if uncommented)
        setIsRefining(false);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-transparent backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800">Create a Post</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full text-slate-400"><X className="w-6 h-6" /></button>
                </div>

                <div className="p-4 overflow-y-auto custom-scrollbar space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 p-2 border border-slate-200 rounded w-fit bg-slate-50">
                            <Users className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-bold text-slate-700">{activeCommunity.name}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            placeholder="Title (required)"
                            className="w-full p-3 border border-slate-200 rounded focus:border-blue-500 outline-none text-sm font-medium"
                        />
                        <div className="flex items-center gap-2">
                            <label className="flex-1 cursor-pointer">
                                <div className="w-full p-3 border border-slate-200 border-dashed rounded bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-2 text-slate-500 transition-colors">
                                    <span className="text-sm font-medium">{image ? "Image Selected (Click to change)" : "Upload Image"}</span>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setImage(reader.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="hidden"
                                />
                            </label>
                            {image && (
                                <div className="h-12 w-12 rounded border border-slate-200 overflow-hidden relative group">
                                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setImage('')}
                                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 text-white transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="border border-slate-200 rounded overflow-hidden">
                            <div className="bg-slate-50 p-2 border-b border-slate-200 flex gap-2">
                                <button className="p-1.5 hover:bg-white rounded text-slate-500"><Bold className="w-4 h-4" /></button>
                                <button className="p-1.5 hover:bg-white rounded text-slate-500"><Italic className="w-4 h-4" /></button>
                                <button className="p-1.5 hover:bg-white rounded text-slate-500"><Link2 className="w-4 h-4" /></button>
                            </div>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Describe your problem in detail..."
                                className="w-full p-4 min-h-[150px] outline-none text-sm resize-none"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 border border-blue-600 text-blue-600 rounded-full font-bold text-sm hover:bg-blue-50">Cancel</button>
                    <button
                        onClick={() => handleCreatePost(title, content, image)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700"
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostModal;
