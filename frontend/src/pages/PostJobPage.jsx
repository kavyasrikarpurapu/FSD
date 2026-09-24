import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, DollarSign, Clock, Tag, Briefcase, Sparkles, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'AI & Machine Learning',
  'DevOps & Cloud',
  'Content & Copywriting',
  'Digital Marketing & SEO',
  'Data Analytics & BI',
  'Cybersecurity & Network'
];

const PostJobPage = () => {
  const navigate = useNavigate();
  const { isClient, user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [description, setDescription] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skillsRequired, setSkillsRequired] = useState(['React', 'Node.js']);
  const [budgetType, setBudgetType] = useState('fixed');
  const [budget, setBudget] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [projectDuration, setProjectDuration] = useState('1 to 4 weeks');
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddSkill = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim().replace(',', '');
      if (newSkill && !skillsRequired.includes(newSkill)) {
        setSkillsRequired([...skillsRequired, newSkill]);
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsRequired(skillsRequired.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (skillsRequired.length === 0) {
      setError('Please add at least one required skill tag.');
      return;
    }

    if (!budget || Number(budget) <= 0) {
      setError('Please enter a valid budget amount.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/jobs', {
        title,
        category,
        description,
        skillsRequired,
        budgetType,
        budget: Number(budget),
        experienceLevel,
        projectDuration,
        featured
      });

      if (res.success && res.job) {
        navigate(`/jobs/${res.job._id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to post project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-8 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
          Client Workspace
        </span>
        <h1 className="text-3xl font-extrabold text-white mt-1">
          Post a New Project Opportunity
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Reach thousands of top-tier verified freelancers in seconds.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center gap-3 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
        
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Project Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Build an AI-Powered Document Search SaaS with React & Python"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">A clear, concise title attracts better proposals.</span>
        </div>

        {/* Category & Experience Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Required Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Entry Level">Entry Level</option>
              <option value="Intermediate">Intermediate Level</option>
              <option value="Expert">Expert Level</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Detailed Project Description *
          </label>
          <textarea
            required
            rows={6}
            placeholder="Describe the scope, deliverables, tech stack requirements, milestones, and expected timelines in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-y"
          />
        </div>

        {/* Skills Tagging */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Skills Required (Press Enter or comma to add)
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {skillsRequired.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-indigo-600/20 text-indigo-300 border border-indigo-500/40"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-indigo-400 hover:text-red-400 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type skill and press enter (e.g. Next.js, Figma, Tailwind, AWS)"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleAddSkill}
            className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Budget & Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Budget Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBudgetType('fixed')}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                  budgetType === 'fixed'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Fixed Price
              </button>
              <button
                type="button"
                onClick={() => setBudgetType('hourly')}
                className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                  budgetType === 'hourly'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                Hourly
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Budget Amount ($) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-500 font-bold">$</span>
              <input
                type="number"
                required
                min="5"
                placeholder="2500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Expected Duration
            </label>
            <select
              value={projectDuration}
              onChange={(e) => setProjectDuration(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Less than 1 week">Less than 1 week</option>
              <option value="1 to 4 weeks">1 to 4 weeks</option>
              <option value="1 to 3 months">1 to 3 months</option>
              <option value="3 to 6 months">3 to 6 months</option>
            </select>
          </div>
        </div>

        {/* Featured Checkbox */}
        <div className="flex items-center gap-3 p-4 bg-slate-800/40 rounded-2xl border border-slate-800">
          <input
            type="checkbox"
            id="featured"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded bg-slate-900 border-slate-700 focus:ring-indigo-500"
          />
          <label htmlFor="featured" className="text-xs text-slate-300 cursor-pointer">
            <strong className="text-white flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Feature this job listing
            </strong>
            Highlight your project on the homepage to attract 3x more proposals.
          </label>
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => navigate('/jobs')}
            className="px-5 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-glow transition-all disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{loading ? 'Publishing...' : 'Publish Job to MongoDB'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default PostJobPage;
