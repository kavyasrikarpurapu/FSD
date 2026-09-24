import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, MapPin, Star, Sparkles, ArrowRight, Eye, UserCheck } from 'lucide-react';

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
    <div className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-glow flex flex-col justify-between group">
      <div>
        {/* Header: Category, Featured Badge, Date */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {job.category}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {job.featured && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo(job.createdAt)}
            </span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/jobs/${job._id}`} className="block group-hover:text-indigo-400 transition-colors">
          <h3 className="text-lg font-bold text-white line-clamp-2 leading-snug">
            {job.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Required Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {job.skillsRequired?.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/50"
            >
              {skill}
            </span>
          ))}
          {job.skillsRequired?.length > 4 && (
            <span className="px-1.5 py-0.5 rounded-md text-xs font-medium text-slate-500">
              +{job.skillsRequired.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Info: Budget, Client Info, Action */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
        <div>
          <div className="text-lg font-bold text-white flex items-center gap-1 text-emerald-400">
            ${job.budget?.toLocaleString()}
            <span className="text-xs font-normal text-slate-400">
              {job.budgetType === 'hourly' ? '/hr' : ' fixed'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            {job.experienceLevel} • {job.proposalsCount || 0} proposals
          </div>
        </div>

        <Link
          to={`/jobs/${job._id}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all duration-200 group-hover:shadow-glow"
        >
          <span>View Job</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
