import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  DollarSign, 
  Users, 
  FileCheck, 
  PlusCircle, 
  Eye, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Clock
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ClientDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [postedJobs, setPostedJobs] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClientData = async () => {
    try {
      const [jobsRes, contractsRes] = await Promise.all([
        api.get('/jobs/client/my-jobs'),
        api.get('/contracts')
      ]);

      if (jobsRes.success) setPostedJobs(jobsRes.jobs || []);
      if (contractsRes.success) setContracts(contractsRes.contracts || []);
    } catch (err) {
      console.error('Client dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setPostedJobs(postedJobs.filter(j => j._id !== jobId));
    } catch (err) {
      alert(err.message || 'Failed to delete job');
    }
  };

  const totalSpent = user?.spent || 0;
  const activeContractsCount = contracts.filter(c => c.status === 'active' || c.status === 'submitted').length;
  const totalProposalsReceived = postedJobs.reduce((sum, j) => sum + (j.proposalsCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome & Post CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Client Control Center</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">{user?.companyName || 'Manage your active projects and candidate bids'}</p>
        </div>

        <Link
          to="/post-job"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-glow transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a New Job</span>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Spent</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">${totalSpent.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-400 mt-1 block">Escrow Protected</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Jobs Posted</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{postedJobs.length}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">{postedJobs.filter(j => j.status === 'open').length} currently open</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Bids Received</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{totalProposalsReceived}</p>
          <span className="text-[11px] text-purple-400 mt-1 block">From verified talent</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Active Contracts</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{activeContractsCount}</p>
          <span className="text-[11px] text-cyan-400 mt-1 block">In development</span>
        </div>

      </div>

      {/* Posted Jobs Table / List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Your Project Postings</h2>
            <p className="text-xs text-slate-400">Review applicants and monitor hiring status</p>
          </div>
        </div>

        {postedJobs.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 rounded-2xl p-6 space-y-3">
            <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-300 font-semibold">You haven't posted any projects yet.</p>
            <Link
              to="/post-job"
              className="inline-block px-4 py-2 bg-indigo-600 rounded-xl text-xs font-semibold text-white"
            >
              Create Your First Job Posting
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3 font-semibold">Job Title</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Budget</th>
                  <th className="pb-3 font-semibold">Proposals</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {postedJobs.map((j) => (
                  <tr key={j._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 pr-4">
                      <Link to={`/jobs/${j._id}`} className="font-bold text-white hover:text-indigo-400 block line-clamp-1">
                        {j.title}
                      </Link>
                      <span className="text-[11px] text-slate-500">
                        Posted {new Date(j.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {j.category}
                      </span>
                    </td>
                    <td className="py-4 pr-4 font-bold text-emerald-400">
                      ${j.budget} ({j.budgetType})
                    </td>
                    <td className="py-4 pr-4 font-semibold text-indigo-300">
                      {j.proposalsCount || 0} bids
                    </td>
                    <td className="py-4 pr-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        j.status === 'open' ? 'bg-emerald-500/20 text-emerald-300' :
                        j.status === 'in_progress' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <Link
                        to={`/jobs/${j._id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View / Bids</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteJob(j._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Active Contracts Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Active Milestone Contracts</h2>
          <Link to="/contracts" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            <span>View All Contracts</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {contracts.length === 0 ? (
          <p className="text-xs text-slate-400 py-4">No active contracts yet. Accept a candidate proposal to start one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contracts.slice(0, 4).map((c) => (
              <div key={c._id} className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{c.job?.title}</h4>
                  <p className="text-xs text-indigo-300 mt-0.5">Freelancer: {c.freelancer?.name}</p>
                  <span className="text-xs font-bold text-emerald-400">${c.amount}</span>
                </div>
                <Link
                  to={`/contracts/${c._id}`}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-semibold transition-all"
                >
                  Manage
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ClientDashboardPage;
