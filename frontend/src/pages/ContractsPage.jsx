import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, Clock, DollarSign, ArrowRight, ShieldCheck, User } from 'lucide-react';
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
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Escrow Protected</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Contracts & Milestones</h1>
          <p className="text-xs text-slate-400 mt-1">Track active agreements, deliveries, and payment releases</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 text-sm">
          Loading contracts from MongoDB Atlas...
        </div>
      ) : contracts.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-3">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No contracts found</h3>
          <p className="text-xs text-slate-400">
            {isClient
              ? 'Accept a candidate proposal to initiate your first contract!'
              : 'Submit proposals on open jobs to start winning contracts!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contracts.map((c) => (
            <div key={c._id} className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-glow flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    c.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    c.status === 'submitted' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {c.status === 'completed' ? '✅ Completed & Paid' :
                     c.status === 'submitted' ? '⏳ Under Review' : '🚀 In Progress'}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <Link to={`/contracts/${c._id}`} className="block group-hover:text-indigo-400 transition-colors">
                  <h3 className="text-lg font-bold text-white line-clamp-1">{c.job?.title}</h3>
                </Link>

                <div className="flex items-center gap-3 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <img
                      src={(isClient ? c.freelancer?.avatar : c.client?.avatar) || `https://api.dicebear.com/7.x/avataaars/svg?seed=user`}
                      alt="avatar"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>{isClient ? `Freelancer: ${c.freelancer?.name}` : `Client: ${c.client?.name}`}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Contract Value</span>
                  <p className="text-base font-bold text-emerald-400">${c.amount?.toLocaleString()}</p>
                </div>

                <Link
                  to={`/contracts/${c._id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all duration-200"
                >
                  <span>Manage Contract</span>
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
