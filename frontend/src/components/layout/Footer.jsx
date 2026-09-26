import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, ShieldCheck, Zap, Globe, Sparkles, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="community" className="bg-[#F4E8D5]/90 border-t border-[#E5D7C5] text-[#75685C] mt-24 relative overflow-hidden">
      {/* Subtle warm ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-t from-[#D6A85F]/15 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#16A085] via-[#12806A] to-[#D6A85F] flex items-center justify-center shadow-warm-md">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#3B3028] font-display">
                Freelance<span className="text-[#16A085]">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-[#75685C] max-w-sm leading-relaxed">
              The premier marketplace connecting forward-thinking enterprises with vetted talent in engineering, AI, UI/UX, and cloud architecture.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF8] border border-[#E5D7C5] text-xs font-semibold text-[#12806A]">
                <ShieldCheck className="w-4 h-4 text-[#16A085]" />
                <span>Verified Escrow</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDF8] border border-[#E5D7C5] text-xs font-semibold text-[#D97757]">
                <Zap className="w-4 h-4 text-[#D97757]" />
                <span>MongoDB Atlas Active</span>
              </div>
            </div>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="text-xs font-bold text-[#3B3028] uppercase tracking-widest mb-4 font-display">For Clients</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/freelancers" className="hover:text-[#16A085] transition-colors font-medium">Find Top Freelancers</Link></li>
              <li><Link to="/post-job" className="hover:text-[#16A085] transition-colors font-medium">Post a Project</Link></li>
              <li><Link to="/jobs" className="hover:text-[#16A085] transition-colors font-medium">Browse Job Postings</Link></li>
              <li><Link to="/client/dashboard" className="hover:text-[#16A085] transition-colors font-medium">Client Dashboard</Link></li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div>
            <h4 className="text-xs font-bold text-[#3B3028] uppercase tracking-widest mb-4 font-display">For Freelancers</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/jobs" className="hover:text-[#16A085] transition-colors font-medium">Find Remote Jobs</Link></li>
              <li><Link to="/freelancers" className="hover:text-[#16A085] transition-colors font-medium">Explore Talent Directory</Link></li>
              <li><Link to="/freelancer/dashboard" className="hover:text-[#16A085] transition-colors font-medium">Freelancer Dashboard</Link></li>
              <li><Link to="/contracts" className="hover:text-[#16A085] transition-colors font-medium">Active Contracts</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-[#3B3028] uppercase tracking-widest mb-4 font-display">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/jobs?category=Web Development" className="hover:text-[#16A085] transition-colors font-medium">Web Development</Link></li>
              <li><Link to="/jobs?category=AI & Machine Learning" className="hover:text-[#16A085] transition-colors font-medium">AI & Data Science</Link></li>
              <li><Link to="/jobs?category=UI/UX Design" className="hover:text-[#16A085] transition-colors font-medium">UI/UX Design</Link></li>
              <li><Link to="/jobs?category=DevOps & Cloud" className="hover:text-[#16A085] transition-colors font-medium">DevOps & Cloud</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-[#E5D7C5] mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#9C8E80]">
          <p>© {new Date().getFullYear()} FreelanceHub. Crafted with Warm Ivory & Emerald Design System.</p>
          <div className="flex items-center gap-6 text-[#75685C]">
            <span className="hover:text-[#16A085] transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#16A085] transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#16A085] transition-colors cursor-pointer">Escrow Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
