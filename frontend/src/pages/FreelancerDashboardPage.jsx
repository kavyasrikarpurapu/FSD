import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, 
  FileCheck, 
  Star, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  ExternalLink,
  Layers,
  UploadCloud
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

  const totalEarnings = user?.earnings || 52000;
  const completedCount = user?.completedProjectsCount || 3;
  const activeContracts = contracts.filter(c => c.status === 'active' || c.status === 'submitted');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 sm:p-8 shadow-warm-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A085]/10 text-[#12806A] text-xs font-bold border border-[#16A085]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#16A085]" />
            <span>Freelancer Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3B3028] font-display">
            Welcome back, {user?.name || 'Specialist'}
          </h1>
          <p className="text-xs sm:text-sm text-[#75685C]">
            Track your milestone contracts, submitted deliverables, earnings, and active proposals.
          </p>
        </div>

        <Link
          to="/jobs"
          className="btn-primary py-3 px-6 text-xs font-bold shadow-warm-md self-start sm:self-auto"
        >
          <span>Browse Available Jobs</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 shadow-warm-sm space-y-1">
          <span className="text-xs font-bold text-[#75685C] uppercase tracking-wider">Total Platform Earnings</span>
          <p className="text-2xl font-black text-[#16A085] font-display">₹{totalEarnings.toLocaleString()}</p>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 shadow-warm-sm space-y-1">
          <span className="text-xs font-bold text-[#75685C] uppercase tracking-wider">Active Contracts</span>
          <p className="text-2xl font-black text-[#3B3028] font-display">{activeContracts.length}</p>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 shadow-warm-sm space-y-1">
          <span className="text-xs font-bold text-[#75685C] uppercase tracking-wider">Completed Projects</span>
          <p className="text-2xl font-black text-[#D6A85F] font-display">{completedCount}</p>
        </div>

        <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 shadow-warm-sm space-y-1">
          <span className="text-xs font-bold text-[#75685C] uppercase tracking-wider">Proposals Sent</span>
          <p className="text-2xl font-black text-[#D97757] font-display">{proposals.length}</p>
        </div>
      </div>

      {/* Active Contracts and Proposals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Active Contracts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 sm:p-8 shadow-warm-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-4">
              <h2 className="text-lg font-bold text-[#3B3028] font-display flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#16A085]" />
                <span>Active Contracts & Milestones ({activeContracts.length})</span>
              </h2>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 bg-[#F4E8D5] rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : activeContracts.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#75685C] space-y-3">
                <p>No active milestone contracts right now.</p>
                <Link to="/jobs" className="btn-primary py-2 px-4 text-xs inline-flex">
                  Explore Open Projects
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeContracts.map((contract) => (
                  <div
                    key={contract._id}
                    className="p-5 rounded-2xl bg-[#F4E8D5]/60 border border-[#E5D7C5] hover:border-[#16A085]/40 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <Link to={`/contracts/${contract._id}`} className="font-bold text-sm text-[#3B3028] hover:text-[#16A085]">
                          {contract.job?.title || 'Contract'}
                        </Link>
                        <p className="text-xs text-[#75685C]">
                          Client: {contract.client?.name || 'Verified Client'}
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-base font-black text-[#16A085] font-display">
                          ₹{contract.totalAmount?.toLocaleString()}
                        </span>
                        <span className={`block text-[10px] font-bold uppercase ${
                          contract.status === 'submitted' ? 'text-[#D97757]' : 'text-[#12806A]'
                        }`}>
                          {contract.status === 'submitted' ? 'Deliverable Submitted' : 'In Progress'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E5D7C5] text-xs">
                      <Link
                        to={`/contracts/${contract._id}`}
                        className="font-semibold text-[#3B3028] hover:text-[#16A085]"
                      >
                        View Details →
                      </Link>

                      {contract.status !== 'completed' && (
                        <button
                          onClick={() => setSelectedContractForSubmission(contract)}
                          className="btn-primary py-1.5 px-3.5 text-xs font-bold"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Submit Deliverable</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Submitted Proposals */}
        <aside className="space-y-6">
          <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 shadow-warm-xl space-y-4">
            <h3 className="text-sm font-bold text-[#3B3028] uppercase tracking-wider font-display flex items-center gap-2">
              <Send className="w-4 h-4 text-[#16A085]" />
              <span>Submitted Proposals ({proposals.length})</span>
            </h3>

            {proposals.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#75685C]">
                No proposals sent yet.
              </div>
            ) : (
              <div className="space-y-3">
                {proposals.slice(0, 5).map((p) => (
                  <div
                    key={p._id}
                    className="p-4 rounded-2xl bg-[#F4E8D5]/60 border border-[#E5D7C5] space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-[#3B3028] truncate">{p.job?.title || 'Proposal'}</h4>
                      <span className="text-xs font-bold text-[#16A085]">₹{p.bidAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#75685C]">
                      <span>{p.estimatedDays} days</span>
                      <span className={`capitalize font-semibold ${
                        p.status === 'accepted' ? 'text-[#16A085]' :
                        p.status === 'rejected' ? 'text-[#c26547]' :
                        'text-[#D6A85F]'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

      </div>

      {/* Deliverable Submission Modal */}
      {selectedContractForSubmission && (
        <DeliverableModal
          contract={selectedContractForSubmission}
          isOpen={Boolean(selectedContractForSubmission)}
          onClose={() => setSelectedContractForSubmission(null)}
          onSuccess={() => {
            fetchFreelancerData();
            setSelectedContractForSubmission(null);
          }}
        />
      )}

    </div>
  );
};

export default FreelancerDashboardPage;
