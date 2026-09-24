import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, Github, Twitter, Linkedin, ShieldCheck, Zap, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Freelance<span className="text-indigo-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The premier marketplace connecting forward-thinking companies with exceptional freelance talent in engineering, AI, design, and growth.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Escrow Protected Payments</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>MongoDB Atlas Powered</span>
              </div>
            </div>
          </div>

          {/* For Clients */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">For Clients</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/freelancers" className="hover:text-indigo-400 transition-colors">Find Top Freelancers</Link></li>
              <li><Link to="/post-job" className="hover:text-indigo-400 transition-colors">Post a Project</Link></li>
              <li><Link to="/jobs" className="hover:text-indigo-400 transition-colors">Browse Job Postings</Link></li>
              <li><Link to="/client/dashboard" className="hover:text-indigo-400 transition-colors">Client Dashboard</Link></li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">For Freelancers</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/jobs" className="hover:text-indigo-400 transition-colors">Find Remote Jobs</Link></li>
              <li><Link to="/freelancers" className="hover:text-indigo-400 transition-colors">Explore Talent Directory</Link></li>
              <li><Link to="/freelancer/dashboard" className="hover:text-indigo-400 transition-colors">Freelancer Dashboard</Link></li>
              <li><Link to="/contracts" className="hover:text-indigo-400 transition-colors">Active Contracts</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/jobs?category=Web Development" className="hover:text-indigo-400 transition-colors">Web Development</Link></li>
              <li><Link to="/jobs?category=AI & Machine Learning" className="hover:text-indigo-400 transition-colors">AI & Data Science</Link></li>
              <li><Link to="/jobs?category=UI/UX Design" className="hover:text-indigo-400 transition-colors">UI/UX Design</Link></li>
              <li><Link to="/jobs?category=DevOps & Cloud" className="hover:text-indigo-400 transition-colors">DevOps & Cloud</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FreelanceHub Inc. All rights reserved. Connected to MongoDB Atlas.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 transition-colors cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
