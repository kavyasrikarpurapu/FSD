import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, Clock, ArrowRight, ShieldCheck, User, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ContractsPage = () => {
  const { user, isClient } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContracts = async () => {
    try {
      const res = await api.get('/contracts');
      if (res.success) {
        setContracts(res.contracts || []);
      }
    } catch (err) {
      console.error('Fetch contracts error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5D7C5] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#16A085]/10 text-[#12806A] text-xs font-bold mb-2 border border-[#16A085]/20">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16A085]" />
            <span>Verified Escrow Milestones</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#3B3028] font-display">Contracts & Agreements</h1>
          <p className="text-xs sm:text-sm text-[#75685C] mt-1">Track active agreements, deliveries, and payment releases</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#75685C] text-sm">
          <div className="w-10 h-10 border-4 border-[#16A085] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading verified contracts...
        </div>
      ) : contracts.length === 0 ? (
        <div className="text-center py-16 bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-8 space-y-3 shadow-warm-sm">
          <FileText className="w-12 h-12 text-[#9C8E80] mx-auto" />
          <h3 className="text-lg font-bold text-[#3B3028] font-display">No contracts found</h3>
          <p className="text-xs text-[#75685C]">
            {isClient
              ? 'Accept a candidate proposal on your project to initiate your first contract!'
              : 'Submit proposals on open jobs to start winning milestone contracts!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contracts.map((c) => (
            <div
              key={c._id}
              className="bg-[#FFFDF8] border border-[#E5D7C5] hover:border-[#16A085] rounded-3xl p-6 transition-all duration-300 hover:shadow-warm-lg hover:-translate-y-1 flex flex-col justify-between group space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    c.status === 'completed' ? 'bg-[#16A085]/15 text-[#12806A] border border-[#16A085]/30' :
                    c.status === 'submitted' ? 'bg-[#D97757]/15 text-[#c26547] border border-[#D97757]/30' :
                    'bg-[#D6A85F]/20 text-[#936d31] border border-[#D6A85F]/35'
                  }`}>
                    {c.status === 'completed' ? 'Completed & Released' :
                     c.status === 'submitted' ? 'Deliverable Submitted' :
                     'In Progress'}
                  </span>

                  <span className="text-lg font-black text-[#16A085] font-display">
                    ₹{c.totalAmount?.toLocaleString()}
                  </span>
                </div>

                <Link to={`/contracts/${c._id}`} className="block group-hover:text-[#16A085] transition-colors">
                  <h3 className="text-base font-bold text-[#3B3028] line-clamp-1 font-display">
                    {c.job?.title || 'Milestone Contract'}
                  </h3>
                </Link>

                <div className="flex items-center gap-4 text-xs text-[#75685C] mt-3 pt-3 border-t border-[#E5D7C5]">
                  <div>
                    <span className="block text-[10px] text-[#9C8E80]">Client</span>
                    <span className="font-semibold text-[#3B3028]">{c.client?.name}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#9C8E80]">Freelancer</span>
                    <span className="font-semibold text-[#3B3028]">{c.freelancer?.name}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#9C8E80]">Milestones</span>
                    <span className="font-semibold text-[#16A085]">{c.milestones?.length || 1} Total</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5D7C5] flex items-center justify-between">
                <span className="text-[11px] text-[#9C8E80]">
                  Started: {new Date(c.createdAt).toLocaleDateString()}
                </span>
                <Link
                  to={`/contracts/${c._id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F4E8D5] hover:bg-[#16A085] text-[#3B3028] hover:text-white transition-all"
                >
                  <span>Open Contract</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ContractsPage;
