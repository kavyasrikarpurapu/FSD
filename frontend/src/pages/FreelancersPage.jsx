import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Sparkles, RefreshCw, Users, Award, ArrowUpDown } from 'lucide-react';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5D7C5] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#16A085]/10 text-[#12806A] text-xs font-bold mb-2 border border-[#16A085]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#16A085]" />
            <span>Verified Professionals</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#3B3028] font-display">Discover Elite Freelancers</h1>
          <p className="text-sm text-[#75685C] mt-1">
            Browse {total} verified engineers, UI/UX designers, and AI specialists ready to hire
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#16A085] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by name, skills, title..."
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

      {/* Main Grid: Filters Sidebar + Freelancers Grid */}
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
                Domain
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

            {/* Badges */}
            <div>
              <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider mb-2 font-display">
                Talent Tier
              </label>
              <div className="space-y-1.5">
                {BADGES.map((b) => (
                  <label key={b} className="flex items-center gap-2 text-xs text-[#75685C] cursor-pointer hover:text-[#16A085] transition-colors">
                    <input
                      type="radio"
                      name="badge"
                      value={b}
                      checked={badge === b}
                      onChange={(e) => setBadge(e.target.value)}
                      className="accent-[#16A085]"
                    />
                    <span className={badge === b ? 'font-bold text-[#16A085]' : ''}>{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider mb-2 font-display">
                Minimum Rating
              </label>
              <div className="flex items-center gap-2">
                {[4, 4.5, 4.8].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setMinRating(minRating === String(r) ? '' : String(r));
                      fetchFreelancers();
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      minRating === String(r)
                        ? 'bg-[#D6A85F] text-white border-[#D6A85F] shadow-sm'
                        : 'bg-[#FFFDF8] text-[#75685C] border-[#E5D7C5] hover:bg-[#F4E8D5]'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    <span>{r}+</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hourly Rate Filter (INR) */}
            <div>
              <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider mb-2 font-display">
                Hourly Rate (₹/hr)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={minRate}
                  onChange={(e) => setMinRate(e.target.value)}
                  className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3 py-1.5 text-xs text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085]"
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={maxRate}
                  onChange={(e) => setMaxRate(e.target.value)}
                  className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3 py-1.5 text-xs text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085]"
                />
              </div>
              <button
                type="button"
                onClick={fetchFreelancers}
                className="w-full mt-2.5 py-1.5 rounded-xl bg-[#F4E8D5] hover:bg-[#E5D7C5] text-xs font-bold text-[#3B3028] transition-colors"
              >
                Apply Rate
              </button>
            </div>

          </div>
        </aside>

        {/* Freelancers List Grid */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Top Sort Controls */}
          <div className="flex items-center justify-between bg-[#FFFDF8] border border-[#E5D7C5] rounded-2xl px-4 py-3 shadow-warm-sm">
            <span className="text-xs font-bold text-[#75685C]">
              Showing <span className="text-[#16A085]">{freelancers.length}</span> talent profiles
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#75685C]" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort freelancers"
                className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3 py-1.5 text-xs text-[#3B3028] focus:outline-none focus:border-[#16A085]"
              >
                <option value="rating">Highest Rated</option>
                <option value="rate_low">Lowest Hourly Rate</option>
                <option value="rate_high">Highest Hourly Rate</option>
                <option value="completed_contracts">Most Contracts Completed</option>
              </select>
            </div>
          </div>

          {/* List or Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 space-y-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-[#F4E8D5] rounded-2xl" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-[#F4E8D5] rounded w-1/2" />
                      <div className="h-3 bg-[#F4E8D5] rounded w-1/3" />
                    </div>
                  </div>
                  <div className="h-10 bg-[#F4E8D5] rounded" />
                </div>
              ))}
            </div>
          ) : freelancers.length === 0 ? (
            <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-12 text-center space-y-4 shadow-warm-sm">
              <div className="w-16 h-16 rounded-3xl bg-[#F4E8D5] flex items-center justify-center mx-auto text-[#75685C]">
                <Users className="w-8 h-8 text-[#16A085]" />
              </div>
              <h3 className="text-xl font-bold text-[#3B3028] font-display">No freelancers found</h3>
              <p className="text-xs text-[#75685C] max-w-sm mx-auto">
                Try modifying your filter settings or search terms to find available talent.
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
