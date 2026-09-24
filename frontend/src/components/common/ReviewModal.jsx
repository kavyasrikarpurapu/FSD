import React, { useState } from 'react';
import { X, Star, Send, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const ReviewModal = ({ contract, isOpen, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment || comment.trim().length < 5) {
      setError('Please leave a comment of at least 5 characters.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/reviews', {
        contractId: contract._id,
        rating,
        comment
      });

      if (res.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white">Leave Feedback & Review</h3>
        <p className="text-xs text-slate-400 mt-1">
          Share your experience working on <span className="text-indigo-300 font-medium">{contract.job?.title}</span>
        </p>

        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 flex items-center gap-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Interactive Star Rating */}
          <div className="flex flex-col items-center justify-center py-2 bg-slate-800/40 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 mb-2 font-medium">Select Rating</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-amber-300 mt-1.5">
              {rating === 5 ? '⭐⭐⭐⭐⭐ Exceptional!' : `${rating} Stars`}
            </span>
          </div>

          {/* Review text */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Your Review & Comments
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the communication, work quality, and delivery speed?"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Submitting...' : 'Submit Review'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ReviewModal;
