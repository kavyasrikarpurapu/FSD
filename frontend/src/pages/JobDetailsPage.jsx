import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
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
    // Only fetch proposals if the user is the job owner or admin
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
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400">Loading project details from MongoDB Atlas...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Job Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'The job you requested does not exist or has been removed.'}</p>
        <Link to="/jobs" className="inline-block px-4 py-2 bg-indigo-600 rounded-xl text-xs font-semibold text-white">
          Back to Jobs Directory
        </Link>
      </div>
    );
  }

  const isJobOwner = user && job.client?._id === user._id;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Button */}
      <Link to="/jobs" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Jobs</span>
      </Link>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-3 text-xs text-emerald-300">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Layout: 2 Columns (Job info + Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Scope, Skills, Description, and Client Proposals View */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Job Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* Header Tags */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {job.category}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                job.status === 'open' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                job.status === 'in_progress' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                'bg-slate-800 text-slate-400'
              }`}>
                {job.status === 'open' ? '🟢 Accepting Proposals' : job.status}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {job.title}
            </h1>

            {/* Meta Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-b border-slate-800/80 py-4 text-xs">
              <div>
                <span className="text-slate-400 block">Budget ({job.budgetType})</span>
                <span className="text-base font-bold text-emerald-400">${job.budget?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Experience Level</span>
                <span className="text-base font-bold text-slate-200">{job.experienceLevel}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Estimated Duration</span>
                <span className="text-base font-bold text-slate-200">{job.projectDuration || '1-4 weeks'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">Project Overview & Scope</h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Required Skills */}
            <div className="space-y-3 pt-4 border-t border-slate-800/80">
              <h3 className="text-sm font-bold text-white">Required Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-800 text-indigo-300 border border-slate-700/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* If Owner: Proposals Manager */}
          {isJobOwner && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Received Proposals</h2>
                  <p className="text-xs text-slate-400">Review candidate bids and accept to start contract</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                  {proposals.length} Bids
                </span>
              </div>

              {proposals.length === 0 ? (
                <div className="p-8 text-center bg-slate-800/30 rounded-xl text-xs text-slate-400">
                  No proposals submitted for this job yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((prop) => (
                    <div key={prop._id} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5 space-y-4">
                      
                      {/* Freelancer Info */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.freelancer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${prop.freelancer?.name}`}
                            alt={prop.freelancer?.name}
                            className="w-12 h-12 rounded-xl object-cover border border-indigo-500/40"
                          />
                          <div>
                            <Link to={`/freelancers/${prop.freelancer?._id}`} className="font-bold text-sm text-white hover:text-indigo-400 transition-colors">
                              {prop.freelancer?.name}
                            </Link>
                            <p className="text-xs text-indigo-300/80">{prop.freelancer?.title}</p>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                                <Star className="w-3 h-3 fill-amber-400" />
                                {prop.freelancer?.rating?.average || 5.0}
                              </span>
                              <span>•</span>
                              <span>${prop.freelancer?.hourlyRate || 50}/hr</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-bold text-emerald-400">${prop.bidAmount}</span>
                          <span className="text-[11px] text-slate-400 block">in {prop.estimatedDays} days</span>
                        </div>
                      </div>

                      {/* Cover letter */}
                      <div className="bg-slate-900/60 p-3 rounded-lg text-xs text-slate-300 whitespace-pre-line border border-slate-800">
                        <strong className="text-slate-400 block mb-1">Cover Letter:</strong>
                        {prop.coverLetter}
                      </div>

                      {/* Status / Actions */}
                      <div className="flex items-center justify-between pt-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                          prop.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-300' :
                          prop.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                          'bg-amber-500/20 text-amber-300'
                        }`}>
                          {prop.status}
                        </span>

                        {prop.status === 'pending' && job.status === 'open' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRejectProposal(prop._id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-red-300 hover:bg-red-950/20 transition-colors"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleAcceptProposal(prop._id)}
                              disabled={actionLoading}
                              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow transition-all"
                            >
                              Hire & Start Contract
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Sidebar: Client Details & Actions */}
        <div className="space-y-6">
          
          {/* Action Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            
            {!isJobOwner ? (
              <>
                {job.status === 'open' ? (
                  <button
                    onClick={() => {
                      if (!user) {
                        navigate('/login');
                      } else {
                        setProposalModalOpen(true);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-glow transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Apply / Submit Proposal</span>
                  </button>
                ) : (
                  <div className="w-full py-3 text-center bg-slate-800 text-slate-400 rounded-xl text-xs font-semibold">
                    Job is {job.status.replace('_', ' ')}
                  </div>
                )}

                {user && (
                  <Link
                    to={`/messages?userId=${job.client?._id}&jobId=${job._id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Contact Project Owner</span>
                  </Link>
                )}
              </>
            ) : (
              <div className="space-y-2">
                <span className="text-xs text-indigo-400 font-semibold block text-center">You posted this job</span>
                {job.contract && (
                  <Link
                    to={`/contracts/${job.contract}`}
                    className="w-full block text-center py-2.5 bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold"
                  >
                    View Active Contract
                  </Link>
                )}
              </div>
            )}

            <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Protected by Escrow Milestone Funding</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>MongoDB Atlas Real-Time Synchronized</span>
              </div>
            </div>

          </div>

          {/* Client Info Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">About the Client</h3>
            
            <div className="flex items-center gap-3">
              <img
                src={job.client?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${job.client?.name}`}
                alt={job.client?.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-700"
              />
              <div>
                <h4 className="text-sm font-bold text-white">{job.client?.name}</h4>
                <p className="text-xs text-indigo-300">{job.client?.companyName || 'Verified Client'}</p>
                <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                  <MapPin className="w-3 h-3" /> {job.client?.location || 'Remote'}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Client Rating:</span>
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {job.client?.rating?.average || 5.0} ({job.client?.rating?.count || 0} reviews)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Spent:</span>
                <span className="text-white font-semibold">${job.client?.spent?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Verification:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Submit Proposal Modal */}
      {proposalModalOpen && (
        <SubmitProposalModal
          job={job}
          isOpen={proposalModalOpen}
          onClose={() => setProposalModalOpen(false)}
          onSuccess={() => {
            setStatusMessage('Proposal submitted successfully! The client will review your bid.');
            fetchJobDetails();
          }}
        />
      )}

    </div>
  );
};

export default JobDetailsPage;
