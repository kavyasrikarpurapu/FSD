import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
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
        <div className="w-12 h-12 border-4 border-[#16A085] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-[#75685C]">Loading escrow contract details...</p>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-[#c26547] mx-auto" />
        <h2 className="text-xl font-bold text-[#3B3028] font-display">Contract Not Found</h2>
        <p className="text-xs text-[#75685C]">{error || 'Unable to find this contract.'}</p>
        <Link to="/contracts" className="btn-primary inline-flex py-2 px-4 text-xs mx-auto">
          Back to Contracts
        </Link>
      </div>
    );
  }

  const isClient = user && contract.client?._id === user._id;
  const isFreelancer = user && contract.freelancer?._id === user._id;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Button */}
      <Link to="/contracts" className="inline-flex items-center gap-1.5 text-xs text-[#75685C] hover:text-[#16A085] transition-colors font-bold">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Contracts</span>
      </Link>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#e8f8f5] border border-[#16A085]/40 flex items-center gap-3 text-xs text-[#12806A] font-semibold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#16A085]" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Contract Details & Milestones */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Card */}
          <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-warm-xl">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#16A085] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Verified Escrow Contract
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                contract.status === 'completed' ? 'bg-[#16A085]/15 text-[#12806A] border border-[#16A085]/30' :
                contract.status === 'submitted' ? 'bg-[#D97757]/15 text-[#c26547] border border-[#D97757]/30' :
                'bg-[#D6A85F]/20 text-[#936d31] border border-[#D6A85F]/35'
              }`}>
                {contract.status === 'completed' ? '🟢 Released & Completed' :
                 contract.status === 'submitted' ? '🟡 Work Submitted for Review' :
                 '🔵 In Progress'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#3B3028] leading-tight font-display">
              {contract.job?.title || 'Contract Details'}
            </h1>

            {/* Total Budget & Status */}
            <div className="p-5 rounded-2xl bg-[#F4E8D5]/60 border border-[#E5D7C5] flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[#75685C] uppercase font-bold block">Total Escrow Value</span>
                <span className="text-2xl font-black text-[#16A085] font-display">
                  ₹{contract.totalAmount?.toLocaleString()}
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#75685C] uppercase font-bold block">Payment Status</span>
                <span className="text-xs font-bold text-[#3B3028]">
                  {contract.escrowStatus === 'released' ? 'Released to Freelancer' : 'Secured in Escrow'}
                </span>
              </div>
            </div>

            {/* Milestones Breakdown */}
            <div className="space-y-4 pt-4 border-t border-[#E5D7C5]">
              <h3 className="text-base font-bold text-[#3B3028] font-display">Contract Milestones</h3>
              <div className="space-y-3">
                {contract.milestones?.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E5D7C5] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        m.status === 'completed' ? 'bg-[#16A085]/15 text-[#16A085]' : 'bg-[#F4E8D5] text-[#75685C]'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#3B3028]">{m.title}</h4>
                        <p className="text-[11px] text-[#75685C]">{m.durationDays} days target</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-[#16A085] font-display">
                      ₹{m.amount?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverable Section */}
            {contract.submissionNotes && (
              <div className="p-5 rounded-2xl bg-[#F4E8D5]/70 border border-[#E5D7C5] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-[#3B3028] flex items-center gap-1.5 uppercase tracking-wider">
                    <UploadCloud className="w-4 h-4 text-[#16A085]" /> Submitted Deliverables
                  </h4>
                  <span className="text-[10px] text-[#9C8E80]">
                    {contract.submittedAt && new Date(contract.submittedAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-[#75685C] whitespace-pre-line leading-relaxed">
                  {contract.submissionNotes}
                </p>

                {contract.submissionLink && (
                  <a
                    href={contract.submissionLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A085] hover:text-[#12806A]"
                  >
                    <span>View Repository / Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

          </div>

        </div>

        {/* Right Sidebar: Verified Marketplace Escrow Panel */}
        <aside className="space-y-6">
          
          {/* Escrow Visualization Panel */}
          <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 sm:p-7 shadow-warm-xl relative space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#16A085] animate-pulse" />
                <span className="text-xs font-bold text-[#3B3028]">Verified Marketplace Escrow</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#16A085]/10 border border-[#16A085]/25 text-[#12806A] text-[10px] font-bold uppercase tracking-wider">
                INSTANT RELEASE
              </span>
            </div>

            {/* Milestone Status */}
            <div className="bg-[#F4E8D5]/60 border border-[#E5D7C5] rounded-2xl p-4 space-y-2">
              <span className="text-[11px] text-[#75685C] uppercase font-bold block">Current Stage</span>
              <div className="flex items-center justify-between text-xs font-bold text-[#3B3028]">
                <span>Milestone 2: Production API & Escrow</span>
                <span className="text-[#16A085] font-black font-display">₹{contract.totalAmount?.toLocaleString() || '1,200.00'}</span>
              </div>
              <div className="w-full bg-[#E5D7C5] rounded-full h-2 overflow-hidden">
                <div className={`h-2 rounded-full ${contract.status === 'completed' ? 'w-full bg-[#16A085]' : 'w-[85%] bg-gradient-to-r from-[#16A085] to-[#D6A85F]'}`} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#75685C] pt-1">
                <span>{contract.status === 'submitted' ? 'Deliverable Submitted' : 'In Progress'}</span>
                <span className="text-[#12806A] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A085]" />
                  {contract.status === 'completed' ? 'Client Approved' : 'Verified'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {isClient && contract.status === 'submitted' && (
              <button
                onClick={handleApproveAndComplete}
                disabled={approving}
                className="btn-primary w-full py-3 text-xs font-bold shadow-warm-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{approving ? 'Releasing...' : 'Approve Work & Release Escrow'}</span>
              </button>
            )}

            {isFreelancer && contract.status === 'active' && (
              <button
                onClick={() => setDeliverableModalOpen(true)}
                className="btn-primary w-full py-3 text-xs font-bold shadow-warm-md"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Submit Work Deliverables</span>
              </button>
            )}

            {contract.status === 'completed' && (
              <button
                onClick={() => setReviewModalOpen(true)}
                className="btn-secondary w-full py-2.5 text-xs font-bold"
              >
                <Star className="w-3.5 h-3.5 text-[#D6A85F]" />
                <span>Leave Feedback Review</span>
              </button>
            )}

            <Link
              to="/messages"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#F4E8D5] hover:bg-[#E5D7C5] text-xs font-bold text-[#3B3028] transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#16A085]" />
              <span>Direct Messages</span>
            </Link>

          </div>

          {/* Parties Profile */}
          <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 space-y-4 shadow-warm-sm">
            <h3 className="text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
              Contract Parties
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={contract.client?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contract.client?.name}`}
                  alt="Client"
                  className="w-10 h-10 rounded-xl object-cover border border-[#E5D7C5]"
                />
                <div>
                  <span className="text-[10px] text-[#9C8E80] block">Client</span>
                  <p className="font-bold text-[#3B3028]">{contract.client?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-[#E5D7C5]">
                <img
                  src={contract.freelancer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contract.freelancer?.name}`}
                  alt="Freelancer"
                  className="w-10 h-10 rounded-xl object-cover border border-[#E5D7C5]"
                />
                <div>
                  <span className="text-[10px] text-[#9C8E80] block">Freelancer</span>
                  <p className="font-bold text-[#3B3028]">{contract.freelancer?.name}</p>
                </div>
              </div>
            </div>
          </div>

        </aside>

      </div>

      {/* Deliverable Modal */}
      {deliverableModalOpen && (
        <DeliverableModal
          contract={contract}
          isOpen={deliverableModalOpen}
          onClose={() => setDeliverableModalOpen(false)}
          onSuccess={() => {
            fetchContract();
            setDeliverableModalOpen(false);
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
            setReviewModalOpen(false);
          }}
        />
      )}

    </div>
  );
};

export default ContractDetailsPage;
