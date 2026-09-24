import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  ArrowLeft, 
  UploadCloud, 
  Star, 
  ExternalLink, 
  MessageSquare,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DeliverableModal from '../components/common/DeliverableModal';
import ReviewModal from '../components/common/ReviewModal';

const ContractDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deliverableModalOpen, setDeliverableModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchContract = async () => {
    try {
      const res = await api.get(`/contracts/${id}`);
      if (res.success) {
        setContract(res.contract);
      }
    } catch (err) {
      setError(err.message || 'Contract not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [id]);

  const handleApproveAndComplete = async () => {
    if (!window.confirm('Approve work and release full escrow payment to the freelancer?')) return;
    setApproving(true);
    try {
      const res = await api.put(`/contracts/${id}/approve`);
      if (res.success) {
        setSuccessMsg('Payment released and contract marked as completed!');
        fetchContract();
      }
    } catch (err) {
      alert(err.message || 'Failed to approve contract');
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400">Loading contract details...</p>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Contract Error</h2>
        <p className="text-xs text-slate-400">{error || 'Unable to access this contract.'}</p>
        <Link to="/contracts" className="inline-block px-4 py-2 bg-indigo-600 rounded-xl text-xs font-semibold text-white">
          Back to Contracts
        </Link>
      </div>
    );
  }

  const isClient = user?._id === contract.client?._id;
  const isFreelancer = user?._id === contract.freelancer?._id;
  const otherUser = isClient ? contract.freelancer : contract.client;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Button */}
      <Link to="/contracts" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Contracts</span>
      </Link>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-3 text-xs text-emerald-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Contract Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Contract ID: {contract._id.slice(-8).toUpperCase()}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                contract.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                contract.status === 'submitted' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {contract.status === 'completed' ? '✅ Completed & Paid' :
                 contract.status === 'submitted' ? '⏳ Deliverable Under Review' : '🚀 In Development'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {contract.job?.title}
            </h1>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl text-center flex-shrink-0">
            <span className="text-xs text-slate-400 block">Total Escrow Amount</span>
            <span className="text-2xl font-black text-emerald-400">${contract.amount?.toLocaleString()}</span>
          </div>
        </div>

        {/* Counterparty Box */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <img
              src={otherUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=user`}
              alt="avatar"
              className="w-10 h-10 rounded-xl object-cover border border-slate-700"
            />
            <div>
              <span className="text-xs text-slate-400 block">{isClient ? 'Freelancer' : 'Client'}</span>
              <span className="text-sm font-bold text-white">{otherUser?.name}</span>
            </div>
          </div>

          <Link
            to={`/messages?userId=${otherUser?._id}&contractId=${contract._id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat Directly</span>
          </Link>
        </div>

      </div>

      {/* Deliverable Status & Actions Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-indigo-400" />
          <span>Deliverables & Milestone Submission</span>
        </h2>

        {contract.submissionNotes || contract.submissionLink ? (
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Submitted Deliverable</span>
              <span className="text-[11px] text-slate-400">
                {contract.submittedAt ? new Date(contract.submittedAt).toLocaleString() : 'Recently'}
              </span>
            </div>

            {contract.submissionLink && (
              <div className="pt-1">
                <span className="text-xs text-slate-400 block mb-1">Project Link / Repo:</span>
                <a
                  href={contract.submissionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 text-xs font-semibold border border-cyan-500/30"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{contract.submissionLink}</span>
                </a>
              </div>
            )}

            {contract.submissionNotes && (
              <div className="pt-2">
                <span className="text-xs text-slate-400 block mb-1">Freelancer Notes:</span>
                <p className="text-xs text-slate-200 whitespace-pre-line bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {contract.submissionNotes}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center bg-slate-800/30 rounded-2xl text-xs text-slate-400">
            No deliverables submitted yet for this contract.
          </div>
        )}

        {/* Action Buttons based on User Role */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-800">
          
          {/* Freelancer Submit Work */}
          {isFreelancer && contract.status === 'active' && (
            <button
              onClick={() => setDeliverableModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Submit Work Deliverable</span>
            </button>
          )}

          {/* Client Approve & Release Payment */}
          {isClient && contract.status === 'submitted' && (
            <button
              onClick={handleApproveAndComplete}
              disabled={approving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-glow transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{approving ? 'Releasing Escrow...' : 'Approve Work & Release Payment ($' + contract.amount + ')'}</span>
            </button>
          )}

          {/* Leave Feedback button when completed */}
          {contract.status === 'completed' && (
            <button
              onClick={() => setReviewModalOpen(true)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold border border-amber-500/30 transition-colors"
            >
              <Star className="w-4 h-4" />
              <span>Leave Feedback & Review</span>
            </button>
          )}

        </div>
      </div>

      {/* Deliverable Modal */}
      {deliverableModalOpen && (
        <DeliverableModal
          contract={contract}
          isOpen={deliverableModalOpen}
          onClose={() => setDeliverableModalOpen(false)}
          onSuccess={() => {
            fetchContract();
            setSuccessMsg('Work submitted successfully! Client has been notified.');
          }}
        />
      )}

      {/* Review Modal */}
      {reviewModalOpen && (
        <ReviewModal
          contract={contract}
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          onSuccess={() => {
            fetchContract();
            setSuccessMsg('Thank you! Your feedback has been recorded in MongoDB Atlas.');
          }}
        />
      )}

    </div>
  );
};

export default ContractDetailsPage;
