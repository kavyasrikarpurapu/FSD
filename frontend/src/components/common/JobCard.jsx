import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, MapPin, Star, Sparkles, ArrowRight, Eye, UserCheck, ShieldCheck } from 'lucide-react';

const JobCard = ({ job }) => {
  const timeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-[#FFFDF8] border border-[#E5D7C5] hover:border-[#16A085] rounded-3xl p-6 transition-all duration-300 hover:shadow-warm-lg hover:-translate-y-1.5 flex flex-col justify-between group relative overflow-hidden">
      {/* Top warm accent shine on hover */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#16A085] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Header: Category, Featured Badge, Date */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#16A085]/10 text-[#12806A] border border-[#16A085]/20">
            {job.category}
          </span>
          <div className="flex items-center gap-2 text-xs text-[#75685C]">
            {job.featured && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D6A85F]/20 text-[#936d31] border border-[#D6A85F]/35">
                <Sparkles className="w-3 h-3 text-[#D6A85F]" /> Featured
              </span>
            )}
            <span className="flex items-center gap-1 text-[11px] text-[#9C8E80]">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo(job.createdAt)}
            </span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/jobs/${job._id}`} className="block group-hover:text-[#16A085] transition-colors">
          <h3 className="text-lg font-bold text-[#3B3028] line-clamp-2 leading-snug font-display">
            {job.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-[#75685C] mt-2 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Required Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {job.skillsRequired?.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#F4E8D5]/80 text-[#3B3028] border border-[#E5D7C5]"
            >
              {skill}
            </span>
          ))}
          {job.skillsRequired?.length > 4 && (
            <span className="px-2 py-0.5 rounded-lg text-xs font-medium text-[#75685C] bg-[#F4E8D5]/50">
              +{job.skillsRequired.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Info: Budget, Proposals, Action */}
      <div className="mt-6 pt-4 border-t border-[#E5D7C5] flex items-center justify-between gap-4">
        <div>
          <div className="text-lg font-extrabold text-[#16A085] flex items-center gap-1 font-display">
            ₹{job.budget?.toLocaleString()}
            <span className="text-xs font-medium text-[#75685C]">
              {job.budgetType === 'hourly' ? '/hr' : ' fixed escrow'}
            </span>
          </div>
          <div className="text-[11px] text-[#75685C] capitalize font-medium">
            {job.experienceLevel} level • {job.proposalsCount || 0} proposals
          </div>
        </div>

        <Link
          to={`/jobs/${job._id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#16A085] hover:bg-[#12806A] text-white transition-all duration-200 shadow-sm group-hover:shadow-warm-md"
        >
          <span>View Job</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
