import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, Briefcase, RefreshCw, Sparkles } from 'lucide-react';
import api from '../services/api';
import JobCard from '../components/common/JobCard';

const CATEGORIES = [
  'All',
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'AI & Machine Learning',
  'DevOps & Cloud',
  'Content & Copywriting',
  'Digital Marketing & SEO'
];

const EXPERIENCE_LEVELS = ['All', 'Entry Level', 'Intermediate', 'Expert'];
const BUDGET_TYPES = ['All', 'fixed', 'hourly'];

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [experienceLevel, setExperienceLevel] = useState('All');
  const [budgetType, setBudgetType] = useState('All');
  const [sort, setSort] = useState('newest');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'All') params.append('category', category);
      if (experienceLevel && experienceLevel !== 'All') params.append('experienceLevel', experienceLevel);
      if (budgetType && budgetType !== 'All') params.append('budgetType', budgetType);
      if (minBudget) params.append('minBudget', minBudget);
      if (maxBudget) params.append('maxBudget', maxBudget);
      if (sort) params.append('sort', sort);

      const res = await api.get(`/jobs?${params.toString()}`);
      if (res.success) {
        setJobs(res.jobs || []);
        setTotalJobs(res.total || 0);
      }
    } catch (err) {
      console.error('Fetch jobs error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlSearch = searchParams.get('search');
    if (urlCategory) setCategory(urlCategory);
    if (urlSearch) setSearch(urlSearch);
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();
  }, [category, experienceLevel, budgetType, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleReset = () => {
    setSearch('');
    setCategory('All');
    setExperienceLevel('All');
    setBudgetType('All');
    setSort('newest');
    setMinBudget('');
    setMaxBudget('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5D7C5] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#16A085]/10 text-[#12806A] text-xs font-bold mb-2 border border-[#16A085]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#16A085]" />
            <span>Curated Opportunities</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#3B3028] font-display">Find Remote Work & Projects</h1>
          <p className="text-sm text-[#75685C] mt-1">
            Explore {totalJobs} active freelance projects across engineering, design, and AI
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#16A085] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by keywords or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085] focus:ring-1 focus:ring-[#16A085]/40 transition-all"
            />
          </div>
          <button
            type="submit"
            className="btn-primary py-2.5 px-5 text-xs shadow-warm-md"
          >
            Search
          </button>
        </form>
      </div>

      {/* Main Grid: Filters Sidebar + Jobs Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 space-y-6 shadow-warm-sm">
            
            <div className="flex items-center justify-between border-b border-[#E5D7C5] pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#3B3028] font-display">
                <Filter className="w-4 h-4 text-[#16A085]" />
                <span>Filters</span>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-[#75685C] hover:text-[#16A085] transition-colors flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider mb-2 font-display">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3 py-2 text-xs text-[#3B3028] focus:outline-none focus:border-[#16A085]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider mb-2 font-display">
                Experience Level
              </label>
              <div className="space-y-1.5">
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <label key={lvl} className="flex items-center gap-2 text-xs text-[#75685C] cursor-pointer hover:text-[#16A085] transition-colors">
                    <input
                      type="radio"
                      name="experienceLevel"
                      value={lvl}
                      checked={experienceLevel === lvl}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="accent-[#16A085]"
                    />
                    <span className={experienceLevel === lvl ? 'font-bold text-[#16A085]' : ''}>{lvl}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget Type */}
            <div>
              <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider mb-2 font-display">
                Project Type
              </label>
              <div className="space-y-1.5">
                {BUDGET_TYPES.map((bt) => (
                  <label key={bt} className="flex items-center gap-2 text-xs text-[#75685C] cursor-pointer hover:text-[#16A085] transition-colors">
                    <input
                      type="radio"
                      name="budgetType"
                      value={bt}
                      checked={budgetType === bt}
                      onChange={(e) => setBudgetType(e.target.value)}
                      className="accent-[#16A085]"
                    />
                    <span className={`capitalize ${budgetType === bt ? 'font-bold text-[#16A085]' : ''}`}>{bt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget Range (INR) */}
            <div>
              <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider mb-2 font-display">
                Budget Range (₹)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                  className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3 py-1.5 text-xs text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085]"
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3 py-1.5 text-xs text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085]"
                />
              </div>
              <button
                type="button"
                onClick={fetchJobs}
                className="w-full mt-2.5 py-1.5 rounded-xl bg-[#F4E8D5] hover:bg-[#E5D7C5] text-xs font-bold text-[#3B3028] transition-colors"
              >
                Apply Range
              </button>
            </div>

          </div>
        </aside>

        {/* Jobs List Grid */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Top Sort Controls */}
          <div className="flex items-center justify-between bg-[#FFFDF8] border border-[#E5D7C5] rounded-2xl px-4 py-3 shadow-warm-sm">
            <span className="text-xs font-bold text-[#75685C]">
              Showing <span className="text-[#16A085]">{jobs.length}</span> results
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#75685C]" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort projects"
                className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3 py-1.5 text-xs text-[#3B3028] focus:outline-none focus:border-[#16A085]"
              >
                <option value="newest">Newest First</option>
                <option value="highest_budget">Highest Budget</option>
                <option value="lowest_budget">Lowest Budget</option>
                <option value="most_proposals">Most Proposals</option>
              </select>
            </div>
          </div>

          {/* List or Loading State */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 space-y-4 animate-pulse">
                  <div className="h-4 bg-[#F4E8D5] rounded w-1/4" />
                  <div className="h-6 bg-[#F4E8D5] rounded w-3/4" />
                  <div className="h-4 bg-[#F4E8D5] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-12 text-center space-y-4 shadow-warm-sm">
              <div className="w-16 h-16 rounded-3xl bg-[#F4E8D5] flex items-center justify-center mx-auto text-[#75685C]">
                <Briefcase className="w-8 h-8 text-[#16A085]" />
              </div>
              <h3 className="text-xl font-bold text-[#3B3028] font-display">No projects found</h3>
              <p className="text-xs text-[#75685C] max-w-sm mx-auto">
                Try adjusting your search criteria, removing filter constraints, or browse all categories.
              </p>
              <button
                onClick={handleReset}
                className="btn-primary py-2 px-6 text-xs mx-auto shadow-warm-sm"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}

        </main>
      </div>

    </div>
  );
};

export default JobsPage;
