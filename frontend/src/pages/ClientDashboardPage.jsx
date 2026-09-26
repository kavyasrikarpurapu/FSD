import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  FileCheck, 
  PlusCircle, 
  Eye, 
  Trash2, 
  ChevronRight,
  Sparkles,
  TrendingUp,
  Clock,
  ShieldCheck,
  MessageSquare
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

  const totalSpent = user?.spent || 45000;
  const activeContractsCount = contracts.filter(c => c.status === 'active' || c.status === 'submitted').length;
  const completedContractsCount = contracts.filter(c => c.status === 'completed').length;
  const totalProposalsReceived = postedJobs.reduce((sum, j) => sum + (j.proposalsCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 sm:p-8 shadow-warm-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A085]/10 text-[#12806A] text-xs font-bold border border-[#16A085]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#16A085]" />
            <span>Client Command Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3B3028] font-display">
            Welcome back, {user?.name || 'Client'}
          </h1>
          <p className="text-xs sm:text-sm text-[#75685C]">
            Manage your project job postings, proposals, contracts, and escrow settlements.
          </p>
        </div>

        <Link
          to="/post-job"
          className="btn-primary py-3 px-6 text-xs font-bold shadow-warm-md self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Project</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 shadow-warm-sm space-y-1">
          <span className="text-xs font-bold text-[#75685C] uppercase tracking-wider">Total Escrow Spent</span>
          <p className="text-2xl font-black text-[#16A085] font-display">₹{totalSpent.toLocaleString()}</p>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 shadow-warm-sm space-y-1">
          <span className="text-xs font-bold text-[#75685C] uppercase tracking-wider">Active Contracts</span>
          <p className="text-2xl font-black text-[#3B3028] font-display">{activeContractsCount}</p>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 shadow-warm-sm space-y-1">
          <span className="text-xs font-bold text-[#75685C] uppercase tracking-wider">Completed Contracts</span>
          <p className="text-2xl font-black text-[#D6A85F] font-display">{completedContractsCount}</p>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 shadow-warm-sm space-y-1">
          <span className="text-xs font-bold text-[#75685C] uppercase tracking-wider">Proposals Received</span>
          <p className="text-2xl font-black text-[#D97757] font-display">{totalProposalsReceived}</p>
        </div>
      </div>

      {/* Posted Jobs & Contracts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: My Project Postings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 sm:p-8 shadow-warm-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-4">
              <h2 className="text-lg font-bold text-[#3B3028] font-display flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#16A085]" />
                <span>My Job Postings ({postedJobs.length})</span>
              </h2>
              <Link to="/post-job" className="text-xs font-bold text-[#16A085] hover:text-[#12806A]">
                + New Project
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 bg-[#F4E8D5] rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : postedJobs.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#75685C] space-y-3">
                <p>You haven't posted any jobs yet.</p>
                <Link to="/post-job" className="btn-primary py-2 px-4 text-xs inline-flex">
                  Create First Project
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {postedJobs.map((j) => (
                  <div
                    key={j._id}
                    className="p-5 rounded-2xl bg-[#F4E8D5]/60 border border-[#E5D7C5] hover:border-[#16A085]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Link to={`/jobs/${j._id}`} className="font-bold text-sm text-[#3B3028] hover:text-[#16A085] truncate">
                          {j.title}
                        </Link>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          j.status === 'open' ? 'bg-[#16A085]/15 text-[#12806A]' : 'bg-[#F4E8D5] text-[#75685C]'
                        }`}>
                          {j.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#75685C]">
                        Budget: <span className="font-bold text-[#16A085]">₹{j.budget?.toLocaleString()}</span> • {j.proposalsCount || 0} Proposals
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/jobs/${j._id}`}
                        className="px-3 py-1.5 rounded-xl bg-[#FFFDF8] hover:bg-[#F4E8D5] border border-[#E5D7C5] text-xs font-semibold text-[#3B3028]"
                      >
                        Manage
                      </Link>
                      <button
                        onClick={() => handleDeleteJob(j._id)}
                        className="p-2 rounded-xl text-[#75685C] hover:text-[#c26547] hover:bg-[#faece5] transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Contracts */}
        <aside className="space-y-6">
          <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 shadow-warm-xl space-y-4">
            <h3 className="text-sm font-bold text-[#3B3028] uppercase tracking-wider font-display flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-[#16A085]" />
              <span>Active Contracts ({contracts.length})</span>
            </h3>

            {contracts.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#75685C]">
                No active contracts in progress.
              </div>
            ) : (
              <div className="space-y-3">
                {contracts.slice(0, 4).map((c) => (
                  <Link
                    key={c._id}
                    to={`/contracts/${c._id}`}
                    className="block p-4 rounded-2xl bg-[#F4E8D5]/60 border border-[#E5D7C5] hover:border-[#16A085] transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-[#3B3028] truncate">{c.job?.title || 'Contract'}</h4>
                      <span className="text-xs font-bold text-[#16A085]">₹{c.totalAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#75685C]">
                      <span>{c.freelancer?.name}</span>
                      <span className="capitalize font-semibold text-[#12806A]">{c.status}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <Link
              to="/contracts"
              className="block w-full text-center py-2 text-xs font-bold text-[#16A085] hover:text-[#12806A] border-t border-[#E5D7C5] pt-3"
            >
              View All Contracts →
            </Link>
          </div>
        </aside>

      </div>

    </div>
  );
};

export default ClientDashboardPage;
