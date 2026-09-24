import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle2, Award, ArrowUpRight } from 'lucide-react';

const FreelancerCard = ({ freelancer }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-glow flex flex-col justify-between group">
      <div>
        {/* Header: Avatar, Name, Badge */}
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={freelancer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${freelancer.name}`}
              alt={freelancer.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/30"
            />
            {freelancer.isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full p-0.5" title="Verified Professional">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <Link to={`/freelancers/${freelancer._id}`} className="hover:text-indigo-400 transition-colors">
                <h3 className="text-base font-bold text-white truncate">{freelancer.name}</h3>
              </Link>
              {freelancer.badge && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {freelancer.badge}
                </span>
              )}
            </div>

            <p className="text-xs text-indigo-300/80 font-medium truncate mt-0.5">
              {freelancer.title || 'Specialist'}
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {freelancer.rating?.average?.toFixed(1) || '5.0'}
                <span className="text-slate-500 font-normal">({freelancer.rating?.count || 0})</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {freelancer.location || 'Remote'}
              </span>
            </div>
          </div>
        </div>

        {/* Bio excerpt */}
        <p className="text-xs text-slate-400 mt-4 line-clamp-2 leading-relaxed">
          {freelancer.bio || 'Top rated verified specialist with demonstrated experience on high-impact projects.'}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {freelancer.skills?.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/50"
            >
              {skill}
            </span>
          ))}
          {freelancer.skills?.length > 4 && (
            <span className="px-1.5 py-0.5 rounded-md text-[11px] font-medium text-slate-500">
              +{freelancer.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer Info: Hourly Rate & Profile CTA */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400">Hourly Rate</span>
          <p className="text-base font-bold text-white">
            ${freelancer.hourlyRate || 50}
            <span className="text-xs font-normal text-slate-400">/hr</span>
          </p>
        </div>

        <Link
          to={`/freelancers/${freelancer._id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 hover:border-indigo-500 transition-all duration-200"
        >
          <span>View Profile</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default FreelancerCard;
