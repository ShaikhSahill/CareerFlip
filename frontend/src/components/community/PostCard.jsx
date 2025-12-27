import React, { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';

const PostCard = ({ post }) => {
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  // Comment State
  const [comments, setComments] = useState(post.replies || []);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isCommentAnimating, setIsCommentAnimating] = useState(false);

  const handleLike = () => {
    setIsLikeAnimating(true);
    setLikesCount(prev => prev + 1);
    setTimeout(() => setIsLikeAnimating(false), 200);
  };

  const handleComment = () => {
    setIsCommentAnimating(true);
    setShowCommentInput(prev => !prev);
    setTimeout(() => setIsCommentAnimating(false), 200);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      author: 'Me',
      content: newComment,
      time: 'Just now'
    };
    setComments([...comments, comment]);
    setNewComment('');
    setShowCommentInput(false);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-300 p-4 shadow-sm transition-colors">

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-slate-500">
          Posted by <span className="font-semibold text-slate-700">{post.author}</span>
        </span>
        <span className="text-xs text-slate-400">• {post.time}</span>
      </div>

      {/* Content Layout */}
      <div className="flex gap-4">

        {/* LEFT: Text */}
        <div className="flex-1">
          <h2 className="font-semibold text-lg text-slate-900 mb-2 leading-tight">
            {post.title}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* RIGHT: Image */}
        {post.image && (
          <div className="w-[180px] h-[120px] rounded-md overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
            <img
              src={post.image}
              alt="Post attachment"
              className="w-full h-full object-contain"
            />
          </div>
        )}

      </div>

      {/* Footer Stats */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 text-slate-500 hover:text-pink-500 transition-all cursor-pointer ${isLikeAnimating ? 'scale-125 text-pink-500' : ''}`}
        >
          <Heart className={`w-4 h-4 ${isLikeAnimating ? 'fill-current' : ''}`} />
          <span className="text-xs font-bold">{likesCount} Likes</span>
        </button>
        <button
          onClick={handleComment}
          className={`flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-all cursor-pointer ${isCommentAnimating ? 'scale-110 text-blue-500' : ''}`}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs font-bold">{comments.length} Comments</span>
        </button>
      </div>

      {/* Comment Input Section */}
      {showCommentInput && (
        <div className="mt-3 pt-3 border-t border-slate-100 animation-fade-in">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full text-sm p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-slate-50 min-h-[80px]"
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setShowCommentInput(false)}
              className="px-3 py-1 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleAddComment}
              className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* Comment List (Preview) */}
      {comments.length > 0 && showCommentInput && (
        <div className="mt-4 space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-slate-50 p-2 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-xs text-slate-700">{comment.author}</span>
                {/* Mock time if missing from dummy data */}
                <span className="text-[10px] text-slate-400">{comment.time || '2h ago'}</span>
              </div>
              <p className="text-sm text-slate-600">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>

  );
};

export default PostCard;
