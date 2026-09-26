import React, { useState } from 'react';
import { X, UploadCloud, Link as LinkIcon, Send, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const DeliverableModal = ({ contract, isOpen, onClose, onSuccess }) => {
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submissionNotes && !submissionLink) {
      setError('Please provide either deliverable notes or a project repository/preview link.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.put(`/contracts/${contract._id}/submit`, {
        submissionNotes,
        submissionLink
      });

      if (res.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit deliverables.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#251E19]/60 backdrop-blur-md">
      <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-warm-xl relative animate-in fade-in zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#75685C] hover:text-[#3B3028] hover:bg-[#F4E8D5] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#16A085]/10 border border-[#16A085]/20 flex items-center justify-center text-[#16A085] shadow-warm-sm">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#3B3028] font-display">Submit Work Deliverables</h3>
            <p className="text-xs text-[#75685C]">Send completed milestone files or live links to client</p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-[#faece5] border border-[#f6d9cd] flex items-center gap-2.5 text-xs text-[#c26547]">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#3B3028] mb-1.5">
              Deliverable URL / Repository / Live Demo
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-[#75685C] absolute left-3.5 top-3.5" />
              <input
                type="url"
                placeholder="https://github.com/your-repo or https://your-demo-url.com"
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
                className="w-full bg-[#FFFDF8] border border-[#E5D7C5] focus:border-[#16A085] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#3B3028] focus:outline-none transition-all shadow-inner placeholder-[#9C8E80]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#3B3028] mb-1.5">
              Delivery Notes & Documentation
            </label>
            <textarea
              required
              rows={4}
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              placeholder="Detail what was completed, setup steps, test instructions, or notes for the client..."
              className="w-full bg-[#FFFDF8] border border-[#E5D7C5] focus:border-[#16A085] rounded-xl p-3.5 text-xs text-[#3B3028] focus:outline-none resize-none transition-all shadow-inner placeholder-[#9C8E80]"
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
              <span>{loading ? 'Submitting...' : 'Submit Deliverable'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default DeliverableModal;
