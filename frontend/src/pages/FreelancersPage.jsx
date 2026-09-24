import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Sparkles, RefreshCw, Users, Award } from 'lucide-react';
import api from '../services/api';
import FreelancerCard from '../components/common/FreelancerCard';

const CATEGORIES = [
  'All',
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'AI & Machine Learning',
  'DevOps & Cloud'
];

const BADGES = ['All', 'Top Rated', 'Expert Pro', 'Rising Talent', 'New'];

const FreelancersPage = () => {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [badge, setBadge] = useState('All');
  const [minRating, setMinRating] = useState('');
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [sort, setSort] = useState('rating');

  const fetchFreelancers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'All') params.append('category', category);
      if (badge && badge !== 'All') params.append('badge', badge);
      if (minRating) params.append('minRating', minRating);
      if (minRate) params.append('minRate', minRate);
      if (maxRate) params.append('maxRate', maxRate);
      if (sort) params.append('sort', sort);

      const res = await api.get(`/freelancers?${params.toString()}`);
      if (res.success) {
        setFreelancers(res.freelancers || []);
        setTotal(res.total || 0);
      }
    } catch (err) {
      console.error('Fetch freelancers error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreelancers();
  }, [category, badge, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFreelancers();
  };

  const handleReset = () => {
    setSearch('');
    setCategory('All');
    setBadge('All');
    setMinRating('');
    setMinRate('');
    setMaxRate('');
    setSort('rating');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Find Top Freelance Talent</h1>
          <p className="text-sm text-slate-400 mt-1">
            Hire from our curated network of {total} verified developers, designers, and AI engineers
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search talent by name, skill, or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-glow transition-all"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-6">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Filter className="w-4 h-4 text-cyan-400" />
                <span>Filters</span>
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Field / Specialization
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Badge */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Talent Tier
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {BADGES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Minimum Rating
              </label>
              <div className="space-y-1.5">
                {[
                  { label: 'Any Rating', val: '' },
                  { label: '4.8 & above ⭐', val: '4.8' },
                  { label: '4.5 & above ⭐', val: '4.5' },
                  { label: '4.0 & above ⭐', val: '4.0' }
                ].map((r) => (
                  <label key={r.val} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white">
                    <input
                      type="radio"
                      name="minRating"
                      value={r.val}
                      checked={minRating === r.val}
                      onChange={(e) => {
                        setMinRating(e.target.value);
                        fetchFreelancers();
                      }}
                      className="text-cyan-600 focus:ring-cyan-500"
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hourly Rate */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Hourly Rate ($/hr)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min $"
                  value={minRate}
                  onChange={(e) => setMinRate(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="number"
                  placeholder="Max $"
                  value={maxRate}
                  onChange={(e) => setMaxRate(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                type="button"
                onClick={fetchFreelancers}
                className="w-full mt-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
              >
                Apply Rates
              </button>
            </div>

          </div>
        </aside>

        {/* Talent Grid */}
        <main className="lg:col-span-3 space-y-6">
          
          <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 p-3 rounded-xl text-xs text-slate-400">
            <span>Showing <strong className="text-white">{freelancers.length}</strong> top professionals</span>
            
            <div className="flex items-center gap-2">
              <span>Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="projects">Most Completed Projects</option>
                <option value="rate-low">Lowest Hourly Rate</option>
                <option value="rate-high">Highest Hourly Rate</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-64 animate-pulse" />
              ))}
            </div>
          ) : freelancers.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl p-8 space-y-3">
              <Users className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No freelancers found</h3>
              <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {freelancers.map((freelancer) => (
                <FreelancerCard key={freelancer._id} freelancer={freelancer} />
              ))}
            </div>
          )}

        </main>

      </div>

    </div>
  );
};

export default FreelancersPage;
