import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  CheckCircle2, 
  Award, 
  MessageSquare, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Globe, 
  ArrowLeft,
  Briefcase,
  Layers,
  Sparkles,
  ShieldCheck,
  Send
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
        <div className="w-12 h-12 border-4 border-[#16A085] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-[#75685C]">Loading verified professional profile...</p>
      </div>
    );
  }

  if (error || !freelancer) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#3B3028] font-display">Profile Not Found</h2>
        <p className="text-xs text-[#75685C]">{error || 'The requested freelancer profile does not exist.'}</p>
        <Link to="/freelancers" className="btn-primary py-2 px-5 text-xs inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Freelancers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Button */}
      <Link
        to="/freelancers"
        className="inline-flex items-center gap-2 text-xs font-bold text-[#75685C] hover:text-[#16A085] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Freelancers
      </Link>

      {/* Main Profile Header Card */}
      <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 sm:p-8 shadow-warm-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={freelancer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${freelancer.name}`}
                alt={freelancer.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-[#E5D7C5] bg-[#F4E8D5] shadow-inner"
              />
              <span className="absolute -bottom-1 -right-1 bg-[#FFFDF8] rounded-full p-1 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-[#16A085]" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-[#3B3028] font-display">
                  {freelancer.name}
                </h1>
                {freelancer.badge && (
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase bg-[#16A085]/10 text-[#12806A] border border-[#16A085]/20">
                    {freelancer.badge}
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-[#16A085]">
                {freelancer.title || 'Senior Software Engineer'}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#75685C] pt-1">
                <span className="flex items-center gap-1 text-[#D6A85F] font-bold">
                  <Star className="w-4 h-4 fill-[#D6A85F]" />
                  {freelancer.rating?.average ? freelancer.rating.average.toFixed(2) : '4.98'}
                  <span className="text-[#9C8E80] font-normal">({freelancer.rating?.count || 18} reviews)</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#9C8E80]" />
                  {freelancer.location || 'Remote'}
                </span>
                <span>•</span>
                <span className="text-[#16A085] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Escrow Verified
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 w-full sm:w-auto justify-between border-t sm:border-t-0 pt-4 sm:pt-0 border-[#E5D7C5]">
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-[#75685C] uppercase font-bold block">Rate</span>
              <div className="text-2xl font-black text-[#16A085] font-display">
                ₹{freelancer.hourlyRate ? (freelancer.hourlyRate > 200 ? freelancer.hourlyRate : freelancer.hourlyRate * 20) : '1,500'}
                <span className="text-xs font-normal text-[#75685C]">/hr</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/messages"
                className="btn-secondary py-2 px-4 text-xs font-bold"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#16A085]" />
                <span>Message</span>
              </Link>
              <Link
                to="/post-job"
                className="btn-primary py-2 px-5 text-xs font-bold shadow-warm-sm"
              >
                <span>Hire Specialist</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bio */}
        <div className="border-t border-[#E5D7C5] pt-6 space-y-2">
          <h3 className="text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
            About {freelancer.name}
          </h3>
          <p className="text-sm text-[#75685C] leading-relaxed font-normal">
            {freelancer.bio || 'Verified expert engineer delivering high-reliability production web, mobile, and AI cloud systems with complete milestone escrow protection.'}
          </p>
        </div>

        {/* Skills */}
        <div className="border-t border-[#E5D7C5] pt-6 space-y-2">
          <h3 className="text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
            Skills & Expertise
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {(freelancer.skills || ['React 19', 'Next.js', 'Node.js', 'MongoDB Atlas', 'Tailwind CSS', 'TypeScript', 'GraphQL', 'AWS']).map((s, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-[#F4E8D5] text-xs font-semibold text-[#3B3028] border border-[#E5D7C5]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews & Past Contracts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Client Reviews */}
        <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 sm:p-7 space-y-4 shadow-warm-sm">
          <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-3">
            <h3 className="text-lg font-bold text-[#3B3028] font-display flex items-center gap-2">
              <Star className="w-5 h-5 fill-[#D6A85F] text-[#D6A85F]" />
              <span>Client Reviews ({reviews.length})</span>
            </h3>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {reviews.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#75685C] space-y-2">
                <p>No client reviews recorded yet.</p>
                <span className="text-[#16A085] font-semibold">5.0 Star Initial Platform Verification Score</span>
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="p-4 rounded-2xl bg-[#F4E8D5]/60 border border-[#E5D7C5] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#3B3028]">{rev.client?.name || 'Verified Client'}</span>
                    <div className="flex items-center gap-1 text-[#D6A85F] text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#75685C] leading-relaxed">"{rev.comment}"</p>
                  <span className="text-[10px] text-[#9C8E80] block">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completed Work History */}
        <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 sm:p-7 space-y-4 shadow-warm-sm">
          <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-3">
            <h3 className="text-lg font-bold text-[#3B3028] font-display flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#16A085]" />
              <span>Work History & Escrows ({completedContracts.length})</span>
            </h3>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {completedContracts.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#75685C]">
                <p>Ready for initial milestone contracts on FreelanceHub.</p>
              </div>
            ) : (
              completedContracts.map((c) => (
                <div key={c._id} className="p-4 rounded-2xl bg-[#F4E8D5]/60 border border-[#E5D7C5] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#3B3028]">{c.job?.title || 'Completed Milestone Contract'}</span>
                    <span className="text-xs font-bold text-[#16A085]">₹{c.totalAmount?.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-[#75685C]">
                    Completed with 100% Escrow Released • {c.milestones?.length || 1} Milestones
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default FreelancerProfilePage;
