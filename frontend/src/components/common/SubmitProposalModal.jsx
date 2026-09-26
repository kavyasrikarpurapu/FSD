import React, { useState } from 'react';
import { X, Clock, Send, Plus, Trash2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const SubmitProposalModal = ({ job, isOpen, onClose, onSuccess }) => {
  const [bidAmount, setBidAmount] = useState(job.budget || 500);
  const [estimatedDays, setEstimatedDays] = useState(14);
  const [coverLetter, setCoverLetter] = useState('');
  const [milestones, setMilestones] = useState([
    { title: 'Initial Milestone & Architecture', amount: Math.round((job.budget || 500) * 0.4), durationDays: 5 },
    { title: 'Core Features & Implementation', amount: Math.round((job.budget || 500) * 0.4), durationDays: 6 },
    { title: 'Final Delivery & Polish', amount: Math.round((job.budget || 500) * 0.2), durationDays: 3 }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddMilestone = () => {
    setMilestones([...milestones, { title: '', amount: 100, durationDays: 3 }]);
  };

  const handleRemoveMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleMilestoneChange = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = field === 'title' ? value : Number(value);
    setMilestones(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!coverLetter || coverLetter.length < 20) {
      setError('Please provide a detailed cover letter (minimum 20 characters).');
      return;
    }

    if (Number(bidAmount) <= 0) {
      setError('Please enter a valid bid amount.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/proposals', {
        jobId: job._id,
        bidAmount: Number(bidAmount),
        estimatedDays: Number(estimatedDays),
        coverLetter,
        milestones
      });

      if (res.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit proposal.');
    } finally {
      setLoading(false);
    }
  };

  // Fee calculation (10% platform fee)
  const serviceFee = (Number(bidAmount) * 0.10).toFixed(2);
  const receiveAmount = (Number(bidAmount) - serviceFee).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#251E19]/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-warm-xl relative animate-in fade-in zoom-in-95 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-[#75685C] hover:text-[#3B3028] hover:bg-[#F4E8D5] border border-transparent hover:border-[#E5D7C5] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="pr-12">
          <span className="text-xs font-bold text-[#16A085] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16A085] animate-ping inline-block"></span>
            Submit Proposal
          </span>
          <h2 className="text-xl font-bold text-[#3B3028] mt-1 font-display">
            {job.title}
          </h2>
          <p className="text-xs text-[#75685C] mt-1">
            Client's Budget: <span className="text-[#16A085] font-bold">₹{job.budget}</span> ({job.budgetType})
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-[#faece5] border border-[#f6d9cd] flex items-center gap-2.5 text-xs text-[#c26547]">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Bid & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3B3028] mb-1.5">
                Your Bid Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-[#16A085] font-bold">₹</span>
                <input
                  type="number"
                  required
                  min="5"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full bg-[#FFFDF8] border border-[#E5D7C5] focus:border-[#16A085] rounded-xl pl-8 pr-4 py-2.5 text-sm text-[#3B3028] focus:outline-none transition-all shadow-inner"
                />
              </div>
              <p className="text-[11px] text-[#75685C] mt-1">
                You'll receive ~<span className="text-[#12806A] font-bold">₹{receiveAmount}</span> (after 10% fee)
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3B3028] mb-1.5">
                Estimated Delivery (Days)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-[#75685C] absolute left-3.5 top-3.5" />
                <input
                  type="number"
                  required
                  min="1"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                  className="w-full bg-[#FFFDF8] border border-[#E5D7C5] focus:border-[#16A085] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#3B3028] focus:outline-none transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-xs font-semibold text-[#3B3028] mb-1.5">
              Cover Letter & Approach
            </label>
            <textarea
              required
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Explain why you are the best fit for this project, past relevant experience, and how you will execute the deliverables..."
              className="w-full bg-[#FFFDF8] border border-[#E5D7C5] focus:border-[#16A085] rounded-xl p-3.5 text-sm text-[#3B3028] focus:outline-none resize-none transition-all shadow-inner placeholder-[#9C8E80]"
            />
          </div>

          {/* Milestones Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#3B3028]">
                Proposed Milestones
              </label>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="text-xs text-[#16A085] hover:text-[#12806A] font-bold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Milestone
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {milestones.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#F4E8D5]/60 p-2.5 rounded-xl border border-[#E5D7C5]">
                  <input
                    type="text"
                    placeholder="Milestone description"
                    value={m.title}
                    onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                    className="flex-1 bg-transparent text-xs text-[#3B3028] placeholder-[#9C8E80] focus:outline-none px-2"
                  />
                  <div className="flex items-center gap-1 w-28">
                    <span className="text-xs text-[#16A085] font-bold">₹</span>
                    <input
                      type="number"
                      value={m.amount}
                      onChange={(e) => handleMilestoneChange(idx, 'amount', e.target.value)}
                      className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-lg px-2 py-1 text-xs text-[#3B3028] focus:outline-none focus:border-[#16A085]"
                    />
                  </div>
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="p-1 text-[#75685C] hover:text-[#c26547] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5D7C5]">
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
              className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Submitting...' : 'Send Proposal'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default SubmitProposalModal;
