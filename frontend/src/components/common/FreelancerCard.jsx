import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, CheckCircle2, Award, ArrowUpRight, Sparkles, Zap, ShieldCheck } from 'lucide-react';

const FreelancerCard = ({ freelancer }) => {
  return (
    <div className="bg-[#FFFDF8] border border-[#E5D7C5] hover:border-[#16A085] rounded-3xl p-6 transition-all duration-300 hover:shadow-warm-lg hover:-translate-y-1.5 flex flex-col justify-between group relative overflow-hidden">
      {/* Top warm accent highlight on hover */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#16A085] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Header: Avatar, Name, Badge, Verification */}
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={freelancer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(freelancer.name || 'freelancer')}`}
              alt={freelancer.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(freelancer.name || 'freelancer')}`;
              }}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#E5D7C5] bg-[#F4E8D5]"
            />
            {freelancer.isVerified !== false && (
              <span className="absolute -bottom-1 -right-1 bg-[#FFFDF8] rounded-full p-0.5 shadow-sm" title="Verified Professional">
                <CheckCircle2 className="w-4 h-4 text-[#16A085] fill-[#16A085]/10" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <Link to={`/freelancers/${freelancer._id}`} className="hover:text-[#16A085] transition-colors">
                <h3 className="text-base font-bold text-[#3B3028] truncate font-display group-hover:text-[#16A085] transition-colors">
                  {freelancer.name}
                </h3>
              </Link>
              {freelancer.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#16A085]/10 text-[#12806A] border border-[#16A085]/20">
                  {freelancer.badge}
                </span>
              )}
            </div>

            <p className="text-xs text-[#75685C] font-semibold truncate mt-0.5">
              {freelancer.title || 'Senior Full Stack Specialist'}
            </p>

            <div className="flex items-center gap-2.5 text-xs text-[#75685C] mt-2">
              <span className="flex items-center gap-1 text-[#D6A85F] font-bold">
                <Star className="w-3.5 h-3.5 fill-[#D6A85F]" />
                {freelancer.rating?.average ? freelancer.rating.average.toFixed(2) : '4.98'}
                <span className="text-[#9C8E80] font-normal">({freelancer.rating?.count || 18})</span>
              </span>
              <span>•</span>
              <span className="text-[#16A085] font-semibold">98% Success</span>
            </div>
          </div>
        </div>

        {/* Availability Badge */}
        <div className="mt-3.5 flex items-center gap-1.5 text-[11px] font-semibold text-[#12806A] bg-[#16A085]/10 px-2.5 py-1 rounded-full w-fit border border-[#16A085]/20">
          <span className="w-2 h-2 rounded-full bg-[#16A085] animate-pulse" />
          <span>Available for projects</span>
        </div>

        {/* Bio excerpt */}
        <p className="text-xs text-[#75685C] mt-3 line-clamp-2 leading-relaxed font-normal">
          {freelancer.bio || 'Top rated verified specialist with demonstrated experience delivering scalable production web & AI architectures.'}
        </p>

        {/* Skills Pills */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {freelancer.skills?.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-[#F4E8D5]/80 text-[#3B3028] border border-[#E5D7C5]"
            >
              {skill}
            </span>
          ))}
          {freelancer.skills?.length > 4 && (
            <span className="px-2 py-0.5 rounded-lg text-[11px] font-medium text-[#75685C] bg-[#F4E8D5]/50">
              +{freelancer.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer Info: Hourly Rate & Profile / Hire Actions */}
      <div className="mt-5 pt-4 border-t border-[#E5D7C5] flex items-center justify-between gap-2">
        <div>
          <span className="text-[11px] text-[#75685C] font-medium">Hourly Rate</span>
          <p className="text-base font-bold text-[#3B3028] font-display">
            <span className="text-[#16A085] font-extrabold">₹{freelancer.hourlyRate ? freelancer.hourlyRate * 20 : '1,500'}</span>
            <span className="text-xs font-normal text-[#75685C]">/hr</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            to={`/freelancers/${freelancer._id}`}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F4E8D5] hover:bg-[#E5D7C5] text-[#3B3028] border border-[#E5D7C5] transition-all"
          >
            View Profile
          </Link>
          <Link
            to={`/freelancers/${freelancer._id}`}
            className="btn-primary py-1.5 px-3 text-xs shadow-none"
          >
            Hire Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FreelancerCard;
