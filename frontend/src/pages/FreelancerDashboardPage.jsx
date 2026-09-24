import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  Send, 
  FileCheck, 
  Star, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DeliverableModal from '../components/common/DeliverableModal';

const FreelancerDashboardPage = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContractForSubmission, setSelectedContractForSubmission] = useState(null);

  const fetchFreelancerData = async () => {
    try {
      const [propsRes, contractsRes] = await Promise.all([
        api.get('/proposals/my-proposals'),
        api.get('/contracts')
      ]);

      if (propsRes.success) setProposals(propsRes.proposals || []);
      if (contractsRes.success) setContracts(contractsRes.contracts || []);
    } catch (err) {
      console.error('Freelancer dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancerData();
  }, []);

  const totalEarnings = user?.earnings || 0;
  const completedCount = user?.completedProjectsCount || 0;
  const activeContracts = contracts.filter(c => c.status === 'active' || c.status === 'submitted');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Freelancer Workspace</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">{user?.title || 'Track your active bids, contracts, and earnings'}</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Find New Projects</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Earnings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">${totalEarnings.toLocaleString()}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Transferred directly</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Completed Projects</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{completedCount}</p>
          <span className="text-[11px] text-cyan-400 mt-1 block">100% On-time delivery</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Active Contracts</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{activeContracts.length}</p>
          <span className="text-[11px] text-indigo-400 mt-1 block">Currently in progress</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Submitted Proposals</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{proposals.length}</p>
          <span className="text-[11px] text-purple-400 mt-1 block">Active bids</span>
        </div>

      </div>

      {/* Ongoing Contracts (Work in progress) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Ongoing Contracts & Milestones</h2>
            <p className="text-xs text-slate-400">Submit deliverables for client approval & payment release</p>
          </div>
        </div>

        {activeContracts.length === 0 ? (
          <div className="text-center py-10 bg-slate-800/30 rounded-2xl p-6 space-y-2">
            <p className="text-sm text-slate-300 font-semibold">No active contracts right now.</p>
            <p className="text-xs text-slate-500">Apply to new jobs to start building contracts!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeContracts.map((c) => (
              <div key={c._id} className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      Client: {c.client?.name}
                    </span>
                    <h3 className="text-base font-bold text-white line-clamp-1 mt-0.5">{c.job?.title}</h3>
                  </div>
                  <span className="text-base font-bold text-emerald-400">${c.amount}</span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                  <span className={`px-2.5 py-1 rounded-full font-bold uppercase text-[10px] tracking-wider ${
                    c.status === 'submitted' ? 'bg-purple-500/20 text-purple-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {c.status === 'submitted' ? 'Deliverable Under Client Review' : 'In Development'}
                  </span>

                  <div className="flex items-center gap-2">
                    {c.status === 'active' && (
                      <button
                        onClick={() => setSelectedContractForSubmission(c)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-glow transition-all"
                      >
                        Submit Work
                      </button>
                    )}
                    <Link
                      to={`/contracts/${c._id}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submitted Proposals Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-white">Your Submitted Proposals</h2>

        {proposals.length === 0 ? (
          <p className="text-xs text-slate-400 py-6">You haven't submitted any job bids yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3 font-semibold">Job Posting</th>
                  <th className="pb-3 font-semibold">Client</th>
                  <th className="pb-3 font-semibold">Your Bid</th>
                  <th className="pb-3 font-semibold">Est. Delivery</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {proposals.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 pr-4">
                      <Link to={`/jobs/${p.job?._id}`} className="font-bold text-white hover:text-cyan-400 block line-clamp-1">
                        {p.job?.title}
                      </Link>
                      <span className="text-[10px] text-slate-500">
                        Submitted {new Date(p.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-300">
                      {p.job?.client?.name || 'Client'}
                    </td>
                    <td className="py-4 pr-4 font-bold text-emerald-400">
                      ${p.bidAmount}
                    </td>
                    <td className="py-4 pr-4">
                      {p.estimatedDays} days
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        p.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-300' :
                        p.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        to={`/jobs/${p.job?._id}`}
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deliverable Modal */}
      {selectedContractForSubmission && (
        <DeliverableModal
          contract={selectedContractForSubmission}
          isOpen={Boolean(selectedContractForSubmission)}
          onClose={() => setSelectedContractForSubmission(null)}
          onSuccess={() => {
            fetchFreelancerData();
            alert('Deliverables submitted successfully! The client has been notified to review and release funds.');
          }}
        />
      )}

    </div>
  );
};

export default FreelancerDashboardPage;
