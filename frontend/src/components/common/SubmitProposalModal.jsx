import React, { useState } from 'react';
import { X, DollarSign, Clock, Send, Plus, Trash2, AlertCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="pr-12">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Submit Proposal
          </span>
          <h2 className="text-xl font-bold text-white mt-1">
            {job.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Client's Budget: <span className="text-emerald-400 font-semibold">${job.budget}</span> ({job.budgetType})
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Bid & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Your Bid Amount ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 font-medium">$</span>
                <input
                  type="number"
                  required
                  min="5"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-8 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                You'll receive ~${receiveAmount} (after 10% fee)
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Estimated Delivery (Days)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="number"
                  required
                  min="1"
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Cover Letter & Approach
            </label>
            <textarea
              required
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Explain why you are the best fit for this project, past relevant experience, and how you will execute the deliverables..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Milestones Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Proposed Milestones
              </label>
              <button
                type="button"
                onClick={handleAddMilestone}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Milestone
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {milestones.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-xl border border-slate-700/60">
                  <input
                    type="text"
                    placeholder="Milestone description"
                    value={m.title}
                    onChange={(e) => handleMilestoneChange(idx, 'title', e.target.value)}
                    className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none px-2"
                  />
                  <div className="flex items-center gap-1 w-24">
                    <span className="text-xs text-slate-500">$</span>
                    <input
                      type="number"
                      value={m.amount}
                      onChange={(e) => handleMilestoneChange(idx, 'amount', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-white"
                    />
                  </div>
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-glow transition-all disabled:opacity-50"
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
