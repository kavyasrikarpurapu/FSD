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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#251E19]/60 backdrop-blur-md">
      <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl w-full max-w-md p-6 sm:p-7 shadow-warm-xl relative animate-in fade-in zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#75685C] hover:text-[#3B3028] hover:bg-[#F4E8D5] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-[#3B3028] font-display">Leave Feedback & Review</h3>
        <p className="text-xs text-[#75685C] mt-1">
          Share your experience working on <span className="text-[#16A085] font-semibold">{contract.job?.title}</span>
        </p>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-[#faece5] border border-[#f6d9cd] flex items-center gap-2.5 text-xs text-[#c26547]">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Interactive Star Rating */}
          <div className="flex flex-col items-center justify-center py-4 bg-[#F4E8D5]/60 rounded-2xl border border-[#E5D7C5]">
            <span className="text-xs text-[#75685C] mb-2 font-semibold">Select Rating</span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 transition-all ${
                      (hoverRating || rating) >= star
                        ? 'fill-[#D6A85F] text-[#D6A85F] drop-shadow-[0_2px_8px_rgba(214,168,95,0.4)]'
                        : 'text-[#D5C3AE]'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-[#936d31] mt-2">
              {rating === 5 ? '★★★★★ Exceptional Quality!' : `${rating} Stars Rating`}
            </span>
          </div>

          {/* Review text */}
          <div>
            <label className="block text-xs font-semibold text-[#3B3028] mb-1.5">
              Your Review & Comments
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the communication, work quality, and delivery speed?"
              className="w-full bg-[#FFFDF8] border border-[#E5D7C5] focus:border-[#16A085] rounded-xl p-3 text-xs text-[#3B3028] focus:outline-none resize-none transition-all shadow-inner placeholder-[#9C8E80]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5D7C5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#75685C] hover:text-[#3B3028] hover:bg-[#F4E8D5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-semibold"
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
