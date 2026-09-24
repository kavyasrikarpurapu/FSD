import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  CheckCircle2, 
  DollarSign, 
  Award, 
  MessageSquare, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Globe, 
  ArrowLeft,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const FreelancerProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [freelancer, setFreelancer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [completedContracts, setCompletedContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFreelancerProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/freelancers/${id}`);
        if (res.success) {
          setFreelancer(res.freelancer);
          setReviews(res.reviews || []);
          setCompletedContracts(res.completedContracts || []);
        }
      } catch (err) {
        setError(err.message || 'Freelancer not found');
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancerProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-400">Loading professional profile...</p>
      </div>
    );
  }

  if (error || !freelancer) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Freelancer Not Found</h2>
        <Link to="/freelancers" className="inline-block px-4 py-2 bg-cyan-600 rounded-xl text-xs font-semibold text-white">
          Back to Freelancers Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back link */}
      <Link to="/freelancers" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Talent Directory</span>
      </Link>

      {/* Main Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <img
                src={freelancer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${freelancer.name}`}
                alt={freelancer.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-indigo-500/30 shadow-glow"
              />
              {freelancer.isVerified && (
                <span className="absolute -bottom-2 -right-2 bg-slate-900 p-1 rounded-full" title="Identity Verified">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400 fill-cyan-400/20" />
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{freelancer.name}</h1>
                {freelancer.badge && (
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {freelancer.badge}
                  </span>
                )}
              </div>

              <p className="text-base font-semibold text-indigo-300">{freelancer.title}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {freelancer.rating?.average?.toFixed(1) || '5.0'} ({freelancer.rating?.count || 0} reviews)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-500" /> {freelancer.location || 'Remote'}
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">
                  {freelancer.completedProjectsCount || 0} Jobs Completed
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
            <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-2xl text-center">
              <span className="text-xs text-slate-400 block">Hourly Rate</span>
              <span className="text-2xl font-black text-white">${freelancer.hourlyRate || 50}<span className="text-xs text-slate-400 font-normal">/hr</span></span>
            </div>

            <button
              onClick={() => {
                if (!user) navigate('/login');
                else navigate(`/messages?userId=${freelancer._id}`);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-glow transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact & Hire</span>
            </button>
          </div>

        </div>

      </div>

      {/* Grid: Bio + Skills + Portfolio + Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Bio, Portfolio, Past Work, Reviews */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About / Bio */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-white">About & Specialization</h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {freelancer.bio || 'Experienced verified specialist with extensive background building mission-critical solutions.'}
            </p>
          </div>

          {/* Portfolio Projects */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>Featured Portfolio Projects</span>
              </h2>
            </div>

            {(!freelancer.portfolio || freelancer.portfolio.length === 0) ? (
              <p className="text-xs text-slate-400">No portfolio items added yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {freelancer.portfolio.map((item, idx) => (
                  <div key={idx} className="bg-slate-800/50 border border-slate-700/60 rounded-xl overflow-hidden group">
                    {item.imageUrl && (
                      <div className="h-36 overflow-hidden bg-slate-900">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4 space-y-2">
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags?.map((t, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-700 text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Client Reviews */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              <span>Client Reviews & Feedback ({reviews.length})</span>
            </h2>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400">No client reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev._id} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.reviewer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.reviewer?.name}`}
                          alt={rev.reviewer?.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                        />
                        <div>
                          <span className="text-xs font-bold text-white">{rev.reviewer?.name}</span>
                          <span className="text-[10px] text-slate-400 block">{rev.job?.title}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Sidebar: Skills, Earnings, Verifications */}
        <div className="space-y-6">
          
          {/* Skills Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Skills & Technologies</h3>
            <div className="flex flex-wrap gap-1.5">
              {freelancer.skills?.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-indigo-300 border border-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Track Record</h3>
            
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Total Earnings:</span>
              <span className="text-emerald-400 font-bold">${freelancer.earnings?.toLocaleString() || 0}+</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Completed Projects:</span>
              <span className="text-white font-bold">{freelancer.completedProjectsCount || 0}</span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Primary Field:</span>
              <span className="text-indigo-300 font-bold">{freelancer.category}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default FreelancerProfilePage;
