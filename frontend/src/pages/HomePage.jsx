import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Users, 
  Briefcase, 
  Award, 
  Star, 
  Code, 
  Palette, 
  BrainCircuit, 
  Cloud, 
  FileText, 
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import api from '../services/api';
import JobCard from '../components/common/JobCard';
import FreelancerCard from '../components/common/FreelancerCard';
import { useAuth } from '../context/AuthContext';
import { Scene } from '../components/common/SparkBadgeScene';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [featuredTalent, setFeaturedTalent] = useState([]);
  const [stats, setStats] = useState({
    totalFreelancers: 4,
    totalClients: 2,
    totalJobs: 5,
    completedContracts: 1,
    totalVolume: 2500
  });
  const [loading, setLoading] = useState(true);

  const { demoLogin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [jobsRes, talentRes, statsRes] = await Promise.all([
          api.get('/jobs?limit=6'),
          api.get('/freelancers/featured/top'),
          api.get('/analytics/platform-stats')
        ]);

        if (jobsRes.success) setFeaturedJobs(jobsRes.jobs || []);
        if (talentRes.success) setFeaturedTalent(talentRes.featured || []);
        if (statsRes.success) setStats(statsRes.stats);
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/jobs');
    }
  };

  const categories = [
    { name: 'Web Development', icon: Code, count: '120+ Jobs', color: 'from-blue-500 to-indigo-600' },
    { name: 'UI/UX Design', icon: Palette, count: '85+ Jobs', color: 'from-purple-500 to-pink-500' },
    { name: 'AI & Machine Learning', icon: BrainCircuit, count: '94+ Jobs', color: 'from-emerald-500 to-cyan-500' },
    { name: 'DevOps & Cloud', icon: Cloud, count: '45+ Jobs', color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-10 lg:pt-16 overflow-hidden">
        {/* Glow backdrop decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-600/15 via-cyan-500/5 to-transparent blur-3xl -z-10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Content & Search */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              {/* Top Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 shadow-glow">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Next-Generation Freelance Marketplace with MongoDB Atlas</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
                Hire World-Class Talent or Build <span className="gradient-text">High-Paying Projects</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                Connect with vetted software engineers, AI specialists, and UI/UX designers. Seamless contract escrow, milestone tracking, and instant delivery.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0 pt-2">
                <div className="relative flex items-center bg-slate-900/90 border-2 border-slate-700/80 hover:border-indigo-500/80 focus-within:border-indigo-500 rounded-2xl p-2 shadow-2xl transition-all">
                  <div className="pl-3 text-slate-400 flex items-center gap-2">
                    <Search className="w-5 h-5 text-indigo-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search skills, e.g. React, Python, UI/UX, Cloud, Node.js..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent px-3 py-2.5 text-white placeholder-slate-400 focus:outline-none text-sm"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-glow transition-all flex-shrink-0"
                  >
                    <span>Find Work</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Popular search tags */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-3 text-xs text-slate-400">
                  <span className="font-semibold text-slate-500">Trending:</span>
                  {['React', 'Next.js', 'MongoDB', 'AI Agents', 'Figma', 'Kubernetes'].map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag)}`)}
                      className="px-2 py-0.5 rounded-lg bg-slate-800/60 hover:bg-indigo-600/20 hover:text-indigo-300 text-slate-300 border border-slate-700/50 transition-colors text-[11px]"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </form>
            </div>

            {/* Right Column: ThreeUI SparkBadge Visual */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="w-full max-w-md h-[460px] relative rounded-3xl p-1 bg-gradient-to-b from-indigo-500/30 via-slate-800/40 to-slate-900/80 shadow-2xl border border-indigo-500/20 group overflow-hidden">
                <div className="absolute top-3 left-4 px-3 py-1 rounded-full bg-slate-900/90 border border-indigo-500/40 text-[10px] font-bold text-indigo-300 z-10 shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Verified Talent Pass & Badge</span>
                </div>
                <Scene />
              </div>
            </div>

          </div>

          {/* Platform Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mt-16 pt-8 border-t border-slate-800/80">
            <div className="bg-slate-900/60 border border-slate-800/60 p-4 rounded-2xl">
              <p className="text-2xl sm:text-3xl font-bold text-white">${stats.totalVolume ? stats.totalVolume.toLocaleString() : '2,500'}+</p>
              <p className="text-xs text-slate-400 mt-1">Paid to Freelancers</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/60 p-4 rounded-2xl">
              <p className="text-2xl sm:text-3xl font-bold text-indigo-400">{stats.totalJobs || 5}+</p>
              <p className="text-xs text-slate-400 mt-1">Active Projects</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/60 p-4 rounded-2xl">
              <p className="text-2xl sm:text-3xl font-bold text-cyan-400">{stats.totalFreelancers || 4}+</p>
              <p className="text-xs text-slate-400 mt-1">Vetted Freelancers</p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800/60 p-4 rounded-2xl">
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400">99.8%</p>
              <p className="text-xs text-slate-400 mt-1">Satisfaction Rate</p>
            </div>
          </div>

        </div>
      </section>

      {/* Top Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Explore Fields</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Browse by Category</h2>
          </div>
          <Link to="/jobs" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300">
            <span>View all categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
                className="bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-2xl transition-all duration-300 hover:shadow-glow hover:-translate-y-1 cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center mb-4 text-white shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Discover verified projects & experts
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400 mt-4 group-hover:translate-x-1 transition-transform">
                  <span>Explore jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Top Opportunities</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Featured Project Postings</h2>
          </div>
          <Link to="/jobs" className="flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300">
            <span>Browse All {featuredJobs.length > 0 ? `(${featuredJobs.length})` : ''}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </section>

      {/* Top Talent Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Verified Pros</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Top Rated Freelancers</h2>
          </div>
          <Link to="/freelancers" className="flex items-center gap-1 text-sm font-semibold text-cyan-400 hover:text-cyan-300">
            <span>View All Talent</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTalent.map((freelancer) => (
            <FreelancerCard key={freelancer._id} freelancer={freelancer} />
          ))}
        </div>
      </section>

      {/* How it Works / Trust Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Streamlined Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">How FreelanceHub Works</h2>
            <p className="text-sm text-slate-400 mt-2">From project posting to final milestone release in three transparent steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-slate-800/40 border border-slate-700/60 p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xl mb-4 border border-indigo-500/30">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Post or Find a Job</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Clients publish detailed scopes, budgets, and required skills. Freelancers discover matching opportunities and submit bids.
              </p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/60 p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold text-xl mb-4 border border-cyan-500/30">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Hire & Collaborate</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Review proposals, compare portfolios, chat directly, and accept bids to initiate secure milestone contracts.
              </p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/60 p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xl mb-4 border border-emerald-500/30">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Approve & Release</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Freelancers submit deliverables with documentation. Clients review, approve, and instantly release milestone payments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-glow">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to scale your next big idea?
            </h2>
            <p className="text-sm text-indigo-200/80 max-w-xl">
              Join thousands of clients and verified freelance specialists using FreelanceHub.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-glow transition-all"
            >
              Get Started Free
            </Link>
            <Link
              to="/jobs"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all"
            >
              Explore Projects
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
