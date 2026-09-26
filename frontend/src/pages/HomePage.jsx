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
  ChevronRight,
  Lock,
  Layers,
  ArrowUpRight,
  Terminal,
  Cpu,
  Globe,
  Database,
  Shield,
  MessageSquare,
  Check,
  Send,
  Flame,
  UserCheck
} from 'lucide-react';
import api from '../services/api';
import JobCard from '../components/common/JobCard';
import FreelancerCard from '../components/common/FreelancerCard';
import { CardSpread } from '../components/ui/card-spread';
import { LenticularCarousel } from '../components/ui/lenticular-carousel';
import ThreeUICharacterCarousel from '../components/common/ThreeUICharacterCarousel';
import MarketplaceWorkflow3D from '../components/common/MarketplaceWorkflow3D';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechTag, setSelectedTechTag] = useState('All');
  const [talentViewMode, setTalentViewMode] = useState('threeui'); // 'threeui' | 'spread' | 'grid'
  const [projectsViewMode, setProjectsViewMode] = useState('carousel'); // 'carousel' | 'grid'
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [featuredTalent, setFeaturedTalent] = useState([]);
  const [stats, setStats] = useState({
    totalFreelancers: 4,
    totalClients: 2,
    totalJobs: 5,
    completedContracts: 1,
    totalVolume: 75000
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
    { 
      name: 'Web Development', 
      icon: Code, 
      count: '120+ Jobs', 
      badge: 'Popular',
      description: 'React, Next.js, Node.js, TypeScript & Microservices'
    },
    { 
      name: 'UI/UX Design', 
      icon: Palette, 
      count: '85+ Jobs', 
      badge: 'High Demand',
      description: 'Design Systems, Figma Prototypes, Mobile & Web Interfaces'
    },
    { 
      name: 'AI & Machine Learning', 
      icon: BrainCircuit, 
      count: '94+ Jobs', 
      badge: 'Trending',
      description: 'RAG Pipelines, Agentic Workflows, PyTorch & LLM Fine-Tuning'
    },
    { 
      name: 'DevOps & Cloud', 
      icon: Cloud, 
      count: '45+ Jobs', 
      badge: 'Enterprise',
      description: 'Kubernetes, AWS/GCP, Docker & Automated CI/CD'
    },
  ];

  const techStackPills = [
    { name: 'All', icon: Sparkles },
    { name: 'React 19', icon: Code },
    { name: 'Next.js', icon: Globe },
    { name: 'TypeScript', icon: Terminal },
    { name: 'Node.js', icon: Cpu },
    { name: 'MongoDB Atlas', icon: Database },
    { name: 'AI & LLMs', icon: BrainCircuit },
    { name: 'Tailwind CSS', icon: Palette },
    { name: 'Docker / Cloud', icon: Cloud }
  ];

  const showcaseProjects = [
    {
      _id: 'p1',
      title: 'AI-Powered Healthcare Dashboard',
      category: 'AI & Full-Stack',
      budget: 45000,
      budgetType: 'fixed',
      timeline: '10 days',
      featured: true,
      description: 'Real-time patient diagnostics analytics engine with HIPAA-compliant FHIR data pipelines and reactive charts.',
      skillsRequired: ['React 19', 'Python', 'AI Agents', 'FastAPI']
    },
    {
      _id: 'p2',
      title: 'E-Commerce Mobile Application & Backend',
      category: 'Mobile & Web',
      budget: 65000,
      budgetType: 'fixed',
      timeline: '14 days',
      featured: true,
      description: 'Cross-platform mobile storefront with biometric payments, real-time inventory tracking, and localized checkout.',
      skillsRequired: ['Flutter', 'Node.js', 'MongoDB Atlas', 'Stripe']
    },
    {
      _id: 'p3',
      title: 'Manufacturing Quality Control Vision System',
      category: 'AI & Machine Learning',
      budget: 80000,
      budgetType: 'fixed',
      timeline: '21 days',
      featured: true,
      description: 'Automated defect detection pipeline using edge computer vision cameras, RAG documentation, and live alerts.',
      skillsRequired: ['Python', 'PyTorch', 'RAG', 'Computer Vision']
    }
  ];

  const filteredJobs = selectedTechTag === 'All' 
    ? (featuredJobs.length > 0 ? featuredJobs : showcaseProjects)
    : (featuredJobs.length > 0 ? featuredJobs : showcaseProjects).filter(j => 
        j.skillsRequired?.some(s => s.toLowerCase().includes(selectedTechTag.toLowerCase())) ||
        j.category?.toLowerCase().includes(selectedTechTag.toLowerCase()) ||
        j.title?.toLowerCase().includes(selectedTechTag.toLowerCase())
      );

  return (
    <div className="space-y-28 pb-20">
      
      {/* 1. Warm Luxury Hero Section */}
      <section className="relative pt-8 lg:pt-16 overflow-hidden">
        {/* Ambient radial glows in warm gold, emerald, and cream */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-[#D6A85F]/15 via-[#16A085]/10 to-transparent blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#D97757]/08 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-40 left-10 w-80 h-80 bg-[#16A085]/08 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Content & Search */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-7">
              
              {/* Dynamic Morphing Pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#16A085]/10 border border-[#16A085]/25 text-[#12806A] text-xs font-bold shadow-warm-sm animate-in fade-in slide-in-from-bottom-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A085] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A085]"></span>
                </span>
                <span>Next-Gen Talent Network • 100% Escrow Protection</span>
              </div>

              {/* Master Typography Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#3B3028] tracking-tight leading-[1.08] font-display">
                Craft Exceptional Products with <span className="gradient-text">Elite Freelancers</span>
              </h1>

              <p className="text-base sm:text-lg text-[#75685C] font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                Connect with vetted engineers, UI/UX architects, and AI developers. Seamless contract milestones, direct messaging, and guaranteed escrow settlements.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0 pt-2">
                <div className="relative flex items-center bg-[#FFFDF8] border border-[#E5D7C5] hover:border-[#16A085] focus-within:border-[#16A085] focus-within:ring-2 focus-within:ring-[#16A085]/20 rounded-2xl p-2 shadow-warm-md transition-all">
                  <div className="pl-3 text-[#75685C] flex items-center gap-2">
                    <Search className="w-5 h-5 text-[#16A085]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search skills, e.g. React, Python, UI/UX, Cloud, Node.js..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent px-3 py-2.5 text-[#3B3028] placeholder-[#9C8E80] focus:outline-none text-sm"
                  />
                  <button
                    type="submit"
                    className="btn-primary py-2.5 px-5 text-xs shadow-warm-md flex-shrink-0"
                  >
                    <span>Find Work</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Popular Trending Tags */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-4 text-xs text-[#75685C]">
                  <span className="font-bold text-[#75685C] flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-[#D97757]" /> Trending:
                  </span>
                  {['React', 'Next.js', 'MongoDB', 'AI Agents', 'Figma', 'Kubernetes'].map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag)}`)}
                      className="px-3 py-1 rounded-xl bg-[#FFFDF8] hover:bg-[#16A085]/10 hover:text-[#16A085] text-[#3B3028] border border-[#E5D7C5] hover:border-[#16A085]/30 transition-all text-[11px] font-semibold"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </form>

              {/* Action Links */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/freelancers"
                  className="btn-secondary py-3 px-6 text-sm shadow-warm-sm"
                >
                  <Users className="w-4 h-4 text-[#16A085]" />
                  <span>Explore Talent</span>
                </Link>
                <Link
                  to="/jobs"
                  className="btn-primary py-3 px-6 text-sm shadow-warm-md"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Find Work →</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Escrow Visualization & Interactive Glass Showcase Card */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="w-full max-w-md bg-[#FFFDF8] rounded-3xl p-6 sm:p-7 shadow-warm-xl border border-[#E5D7C5] relative space-y-5 hover:border-[#16A085] transition-all group">
                
                {/* Header status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#16A085] animate-pulse" />
                    <span className="text-xs font-bold text-[#3B3028]">Verified Marketplace Escrow</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#16A085]/10 border border-[#16A085]/25 text-[#12806A] text-[10px] font-bold uppercase tracking-wider">
                    INSTANT RELEASE
                  </span>
                </div>

                {/* Freelancer Profile Preview Card */}
                <div className="bg-[#F4E8D5]/70 border border-[#E5D7C5] hover:border-[#16A085]/40 rounded-2xl p-4 flex items-center gap-3.5 transition-all">
                  <img
                    src="/hero-freelancer.jpg"
                    alt="Alex Rivera - Featured Senior Full-Stack Architect"
                    className="w-14 h-14 rounded-2xl border border-[#E5D7C5] object-cover bg-[#FFFDF8] shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-[#3B3028] text-sm truncate font-display">Alex Rivera</h4>
                      <CheckCircle2 className="w-4 h-4 text-[#16A085] flex-shrink-0" />
                    </div>
                    <p className="text-xs text-[#12806A] font-semibold truncate">Senior Full-Stack Architect</p>
                    <div className="flex items-center gap-2.5 mt-1 text-[11px] text-[#75685C]">
                      <span className="flex items-center text-[#D6A85F] font-bold gap-0.5">
                        <Star className="w-3 h-3 fill-[#D6A85F]" /> 4.98
                      </span>
                      <span>•</span>
                      <span className="text-[#3B3028] font-bold">₹1,800/hr</span>
                      <span>•</span>
                      <span className="text-[#16A085] font-semibold">98% Success</span>
                    </div>
                  </div>
                </div>

                {/* Active Milestone Progress Card */}
                <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-2xl p-4 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#3B3028]">Milestone 2: Production API & Escrow</span>
                    <span className="font-extrabold text-[#16A085] font-display text-sm">₹1,200.00</span>
                  </div>
                  <div className="w-full bg-[#F4E8D5] rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#16A085] via-[#12806A] to-[#D6A85F] h-2 rounded-full w-[85%]" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#75685C]">
                    <span className="font-medium">Deliverable Submitted</span>
                    <span className="text-[#12806A] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A085]" /> Client Approved
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link
                    to="/freelancers"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#F4E8D5] hover:bg-[#E5D7C5] border border-[#E5D7C5] text-xs font-bold text-[#3B3028] transition-all text-center"
                  >
                    <Users className="w-3.5 h-3.5 text-[#16A085]" />
                    <span>Browse Talent</span>
                  </Link>
                  <Link
                    to="/jobs"
                    className="btn-primary py-2.5 px-3 text-xs shadow-warm-md"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>View Projects</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Platform Trust & Metric Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 shadow-warm-sm text-center space-y-1">
            <span className="text-3xl font-black text-[#16A085] font-display">
              ₹{(stats.totalVolume || 75000).toLocaleString()}+
            </span>
            <p className="text-xs font-bold text-[#75685C] uppercase tracking-wider">Escrow Volume</p>
          </div>

          <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 shadow-warm-sm text-center space-y-1">
            <span className="text-3xl font-black text-[#3B3028] font-display">
              {stats.totalFreelancers || 4}+
            </span>
            <p className="text-xs font-bold text-[#75685C] uppercase tracking-wider">Verified Engineers</p>
          </div>

          <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 shadow-warm-sm text-center space-y-1">
            <span className="text-3xl font-black text-[#D97757] font-display">
              100%
            </span>
            <p className="text-xs font-bold text-[#75685C] uppercase tracking-wider">Milestone Guarantee</p>
          </div>

          <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 shadow-warm-sm text-center space-y-1">
            <span className="text-3xl font-black text-[#D6A85F] font-display">
              4.98 ★
            </span>
            <p className="text-xs font-bold text-[#75685C] uppercase tracking-wider">Average Rating</p>
          </div>
        </div>
      </section>

      {/* 3. ThreeUI 3D Featured Talent Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#16A085]/10 border border-[#16A085]/20 text-[#12806A] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#16A085]" />
              <span>ThreeUI 3D Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#3B3028] tracking-tight font-display">
              Meet the Talent
            </h2>
            <p className="text-sm sm:text-base text-[#75685C] max-w-xl">
              Explore verified professionals ready to bring your next idea to life.
            </p>
          </div>

          <Link
            to="/freelancers"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#16A085] hover:text-[#12806A] transition-colors self-start md:self-auto"
          >
            <span>View All Freelancers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ThreeUI Character Carousel Component */}
        <ThreeUICharacterCarousel freelancers={featuredTalent} />
      </section>

      {/* 4. Domain & Category Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97757]/10 border border-[#D97757]/20 text-[#c26547] text-xs font-bold">
            <Layers className="w-3.5 h-3.5" /> High Demand Domains
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#3B3028] tracking-tight font-display">
            Browse by Specialization
          </h2>
          <p className="text-sm text-[#75685C]">
            Hire world-class talent across specialized modern disciplines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                className="bg-[#FFFDF8] border border-[#E5D7C5] hover:border-[#16A085] rounded-3xl p-6 shadow-warm-sm hover:shadow-warm-lg hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#16A085]/10 border border-[#16A085]/20 flex items-center justify-center text-[#16A085] group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F4E8D5] text-[#75685C] border border-[#E5D7C5]">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#3B3028] font-display group-hover:text-[#16A085] transition-colors mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#75685C] leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#E5D7C5] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#16A085]">{cat.count}</span>
                  <span className="flex items-center gap-1 font-semibold text-[#3B3028] group-hover:translate-x-1 transition-transform">
                    Explore <ArrowRight className="w-3.5 h-3.5 text-[#16A085]" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. Dimensional Featured Projects Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6A85F]/15 border border-[#D6A85F]/30 text-[#936d31] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" /> 3D Project Gallery
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#3B3028] tracking-tight font-display">
              Featured Projects
            </h2>
            <p className="text-sm text-[#75685C]">
              High-value milestone contracts actively looking for top verified builders.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="flex items-center bg-[#F4E8D5] p-1 rounded-xl border border-[#E5D7C5]">
              <button
                onClick={() => setProjectsViewMode('carousel')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  projectsViewMode === 'carousel'
                    ? 'bg-[#16A085] text-white shadow-sm'
                    : 'text-[#75685C] hover:text-[#3B3028]'
                }`}
              >
                3D Stage
              </button>
              <button
                onClick={() => setProjectsViewMode('grid')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  projectsViewMode === 'grid'
                    ? 'bg-[#16A085] text-white shadow-sm'
                    : 'text-[#75685C] hover:text-[#3B3028]'
                }`}
              >
                Grid View
              </button>
            </div>

            <Link
              to="/jobs"
              className="btn-primary py-2 px-4 text-xs font-semibold shadow-warm-sm"
            >
              <span>Explore All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Dynamic Project Presentation */}
        {projectsViewMode === 'carousel' ? (
          <LenticularCarousel items={filteredJobs.length > 0 ? filteredJobs : showcaseProjects} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filteredJobs.length > 0 ? filteredJobs : showcaseProjects).map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* 6. ThreeUI Perspective Marketplace Workflow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MarketplaceWorkflow3D />
      </section>

      {/* 7. Call To Action Footer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden bg-gradient-to-tr from-[#FFFDF8] via-[#F4E8D5] to-[#FFF9F0] border border-[#E5D7C5] shadow-warm-xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16A085]/10 border border-[#16A085]/25 text-[#12806A] text-xs font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-[#16A085]" />
            <span>Join 10,000+ Teams & Builders</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#3B3028] tracking-tight max-w-2xl mx-auto font-display">
            Ready to Build Your Next Breakthrough?
          </h2>

          <p className="text-sm sm:text-base text-[#75685C] max-w-xl mx-auto">
            Get started in under two minutes. Post a project or join as an elite freelancer with verified escrow security.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="btn-primary py-3.5 px-8 text-sm font-bold shadow-warm-lg"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/freelancers"
              className="btn-secondary py-3.5 px-8 text-sm font-bold shadow-warm-sm"
            >
              <span>Browse Top Freelancers</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
