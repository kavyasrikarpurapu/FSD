import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  MapPin, 
  Calendar, 
  Building, 
  Star, 
  CheckCircle2, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  Send, 
  ArrowLeft,
  MessageSquare,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import SubmitProposalModal from '../components/common/SubmitProposalModal';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isClient, isFreelancer } = useAuth();

  const [job, setJob] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchJobDetails = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      if (res.success) {
        setJob(res.job);
      }
    } catch (err) {
      setError(err.message || 'Job not found');
    }
  };

  const fetchJobProposals = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/proposals/job/${id}`);
      if (res.success) {
        setProposals(res.proposals || []);
      }
    } catch (err) {
      // Ignore if not authorized
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchJobDetails();
      setLoading(false);
    };
    loadData();
  }, [id]);

  useEffect(() => {
    if (job && user && (job.client?._id === user._id || user.role === 'admin')) {
      fetchJobProposals();
    }
  }, [job?._id, user?._id]);

  const handleAcceptProposal = async (proposalId) => {
    if (!window.confirm('Are you sure you want to accept this proposal and initiate the contract?')) return;
    setActionLoading(true);
    try {
      const res = await api.put(`/proposals/${proposalId}/accept`);
      if (res.success) {
        setStatusMessage('Proposal accepted and contract initiated!');
        fetchJobDetails();
        fetchJobProposals();
        if (res.contractId) {
          navigate(`/contracts/${res.contractId}`);
        }
      }
    } catch (err) {
      alert(err.message || 'Failed to accept proposal.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectProposal = async (proposalId) => {
    try {
      await api.put(`/proposals/${proposalId}/reject`);
      fetchJobProposals();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-[#16A085] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-[#75685C]">Loading project details from database...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-[#c26547] mx-auto" />
        <h2 className="text-xl font-bold text-[#3B3028] font-display">Job Not Found</h2>
        <p className="text-xs text-[#75685C]">{error || 'The job you requested does not exist or has been removed.'}</p>
        <Link to="/jobs" className="btn-primary inline-flex py-2 px-4 text-xs mx-auto">
          Back to Jobs Directory
        </Link>
      </div>
    );
  }

  const isJobOwner = user && job.client?._id === user._id;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Button */}
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-xs text-[#75685C] hover:text-[#16A085] transition-colors font-bold">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Jobs</span>
      </Link>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-[#e8f8f5] border border-[#16A085]/40 flex items-center gap-3 text-xs text-[#12806A] font-semibold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#16A085]" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Scope, Skills, Description */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Job Card */}
          <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-warm-xl">
            
            {/* Header Tags */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#16A085]/10 text-[#12806A] border border-[#16A085]/20">
                {job.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                job.status === 'open' ? 'bg-[#16A085]/15 text-[#12806A] border border-[#16A085]/30' :
                job.status === 'in_progress' ? 'bg-[#D6A85F]/20 text-[#936d31] border border-[#D6A85F]/35' :
                'bg-[#F4E8D5] text-[#75685C]'
              }`}>
                {job.status === 'open' ? '🟢 Accepting Proposals' : job.status}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-[#3B3028] leading-tight font-display">
              {job.title}
            </h1>

            {/* Meta Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-b border-[#E5D7C5] py-4 text-xs">
              <div>
                <span className="text-[#75685C] font-semibold block">Budget ({job.budgetType})</span>
                <span className="text-xl font-black text-[#16A085] font-display">₹{job.budget?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[#75685C] font-semibold block">Experience Level</span>
                <span className="text-sm font-bold text-[#3B3028] capitalize">{job.experienceLevel}</span>
              </div>
              <div>
                <span className="text-[#75685C] font-semibold block">Estimated Duration</span>
                <span className="text-sm font-bold text-[#3B3028]">{job.projectDuration || '1-4 weeks'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#3B3028] font-display">Project Overview & Scope</h3>
              <p className="text-sm text-[#75685C] leading-relaxed whitespace-pre-line font-normal">
                {job.description}
              </p>
            </div>

            {/* Required Skills */}
            <div className="space-y-3 pt-4 border-t border-[#E5D7C5]">
              <h3 className="text-sm font-bold text-[#3B3028] font-display">Required Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#F4E8D5] text-[#3B3028] border border-[#E5D7C5]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* If Owner: Proposals Manager */}
          {isJobOwner && (
            <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-warm-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#3B3028] font-display">Received Proposals</h2>
                  <p className="text-xs text-[#75685C]">Review candidate bids and accept to start escrow contract</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#16A085]/10 text-[#12806A] text-xs font-bold">
                  {proposals.length} Total
                </span>
              </div>

              {proposals.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#75685C]">
                  No proposals submitted yet. Verified freelancers will submit bids soon.
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((prop) => (
                    <div
                      key={prop._id}
                      className="p-5 rounded-2xl bg-[#F4E8D5]/60 border border-[#E5D7C5] space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.freelancer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${prop.freelancer?.name}`}
                            alt={prop.freelancer?.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#E5D7C5] bg-[#FFFDF8]"
                          />
                          <div>
                            <Link to={`/freelancers/${prop.freelancer?._id}`} className="hover:text-[#16A085]">
                              <h4 className="font-bold text-sm text-[#3B3028]">{prop.freelancer?.name}</h4>
                            </Link>
                            <p className="text-xs text-[#75685C]">{prop.freelancer?.title}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-black text-[#16A085] font-display">₹{prop.bidAmount?.toLocaleString()}</span>
                          <span className="text-[11px] text-[#75685C] block">in {prop.estimatedDays} days</span>
                        </div>
                      </div>

                      <p className="text-xs text-[#75685C] leading-relaxed bg-[#FFFDF8] p-3.5 rounded-xl border border-[#E5D7C5]">
                        "{prop.coverLetter}"
                      </p>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        {prop.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleRejectProposal(prop._id)}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#c26547] hover:bg-[#faece5] border border-transparent hover:border-[#f6d9cd]"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleAcceptProposal(prop._id)}
                              disabled={actionLoading}
                              className="btn-primary py-1.5 px-4 text-xs font-bold"
                            >
                              <span>Accept & Initiate Contract</span>
                            </button>
                          </>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#16A085]/10 text-[#12806A]">
                            {prop.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          
          {/* Action Box for Freelancers */}
          {!isJobOwner && (
            <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 space-y-5 shadow-warm-xl">
              <div className="space-y-1">
                <span className="text-xs text-[#75685C] font-semibold block">Client Budget</span>
                <div className="text-3xl font-black text-[#16A085] font-display">
                  ₹{job.budget?.toLocaleString()}
                </div>
                <span className="text-xs text-[#75685C] block">
                  {job.budgetType === 'hourly' ? 'Hourly rate payment' : 'Guaranteed escrow milestone'}
                </span>
              </div>

              {job.status === 'open' ? (
                user ? (
                  isFreelancer ? (
                    <button
                      onClick={() => setProposalModalOpen(true)}
                      className="btn-primary w-full py-3 text-sm font-bold shadow-warm-md"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit a Proposal</span>
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-[#F4E8D5] text-xs text-[#75685C] text-center font-medium">
                      Signed in as Client. Switch or register as Freelancer to submit bids.
                    </div>
                  )
                ) : (
                  <Link
                    to="/login"
                    className="btn-primary block w-full py-3 text-center text-sm font-bold shadow-warm-md"
                  >
                    Log In to Apply
                  </Link>
                )
              ) : (
                <div className="p-3.5 rounded-2xl bg-[#F4E8D5] text-xs text-[#75685C] text-center font-bold">
                  This project is currently {job.status}.
                </div>
              )}

              <div className="pt-4 border-t border-[#E5D7C5] space-y-2.5 text-xs text-[#75685C]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#16A085]" />
                  <span>100% Escrow Milestone Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D97757]" />
                  <span>Direct Messaging upon Acceptance</span>
                </div>
              </div>
            </div>
          )}

          {/* Client Details Card */}
          <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 space-y-4 shadow-warm-sm">
            <h3 className="text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
              About the Client
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={job.client?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${job.client?.name}`}
                alt={job.client?.name}
                className="w-12 h-12 rounded-2xl object-cover border border-[#E5D7C5] bg-[#F4E8D5]"
              />
              <div>
                <h4 className="font-bold text-sm text-[#3B3028]">{job.client?.name || 'Verified Client'}</h4>
                <p className="text-xs text-[#75685C]">{job.client?.company || 'Enterprise Partner'}</p>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-[#E5D7C5] text-xs text-[#75685C]">
              <div className="flex items-center justify-between">
                <span>Location:</span>
                <span className="font-semibold text-[#3B3028]">{job.client?.location || 'India (Remote)'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Payment Method:</span>
                <span className="font-semibold text-[#16A085] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Escrow
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Member Since:</span>
                <span className="font-semibold text-[#3B3028]">
                  {job.client?.createdAt ? new Date(job.client.createdAt).getFullYear() : '2025'}
                </span>
              </div>
            </div>
          </div>

        </aside>

      </div>

      {/* Submit Proposal Modal */}
      {proposalModalOpen && (
        <SubmitProposalModal
          job={job}
          isOpen={proposalModalOpen}
          onClose={() => setProposalModalOpen(false)}
          onSuccess={() => {
            setStatusMessage('Your proposal was submitted successfully!');
            fetchJobDetails();
          }}
        />
      )}

    </div>
  );
};

export default JobDetailsPage;
