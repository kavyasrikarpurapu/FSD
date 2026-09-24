import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, Briefcase, RefreshCw } from 'lucide-react';
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
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Find Remote Work & Projects</h1>
          <p className="text-sm text-slate-400 mt-1">
            Explore {totalJobs} active freelance projects across engineering, design, and AI
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by keywords or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* Main Grid: Filters Sidebar + Jobs Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-6">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Filter className="w-4 h-4 text-indigo-400" />
                <span>Filters</span>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Experience Level
              </label>
              <div className="space-y-1.5">
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <label key={lvl} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white">
                    <input
                      type="radio"
                      name="experienceLevel"
                      value={lvl}
                      checked={experienceLevel === lvl}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{lvl}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget Type */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Project Type
              </label>
              <div className="space-y-1.5">
                {BUDGET_TYPES.map((bt) => (
                  <label key={bt} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white">
                    <input
                      type="radio"
                      name="budgetType"
                      value={bt}
                      checked={budgetType === bt}
                      onChange={(e) => setBudgetType(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="capitalize">{bt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Budget Range ($)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min $"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Max $"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="button"
                onClick={fetchJobs}
                className="w-full mt-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
              >
                Apply Range
              </button>
            </div>

          </div>
        </aside>

        {/* Jobs List */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-3 rounded-xl text-xs text-slate-400">
            <span>Showing <strong className="text-white">{jobs.length}</strong> matching projects</span>
            
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="newest">Newest First</option>
                <option value="budget-high">Highest Budget</option>
                <option value="budget-low">Lowest Budget</option>
                <option value="proposals">Most Proposals</option>
              </select>
            </div>
          </div>

          {/* Job Cards */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-64 animate-pulse" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl p-8 space-y-3">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No matching jobs found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try clearing your search query or loosening your category and budget filters.
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold mt-2"
              >
                Clear All Filters
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
