import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Clock, Tag, Briefcase, Sparkles, AlertCircle, X, ShieldCheck } from 'lucide-react';
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
  'Data Analytics & BI'
];

const PostJobPage = () => {
  const navigate = useNavigate();
  const { isClient, user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [description, setDescription] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skillsRequired, setSkillsRequired] = useState(['React 19', 'Node.js', 'MongoDB']);
  const [budgetType, setBudgetType] = useState('fixed');
  const [budget, setBudget] = useState('45000');
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
      setError('Please specify a valid budget amount.');
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

      if (res.success) {
        navigate(`/jobs/${res.job._id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to post project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-2 border-b border-[#E5D7C5] pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#16A085]/10 text-[#12806A] text-xs font-bold border border-[#16A085]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#16A085]" />
          <span>Client Project Creator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#3B3028] font-display">Post a New Project</h1>
        <p className="text-sm text-[#75685C]">
          Reach thousands of vetted freelancers and receive proposals with escrow security.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-[#faece5] border border-[#f6d9cd] flex items-center gap-3 text-xs text-[#c26547]">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 sm:p-10 shadow-warm-xl space-y-8">
        
        {/* Project Title */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
            Project Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Build an AI-Powered Healthcare Dashboard with React & Python"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-4 py-3 text-sm text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085] shadow-inner"
          />
        </div>

        {/* Category & Experience Level Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
              Category / Domain *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-4 py-3 text-sm text-[#3B3028] focus:outline-none focus:border-[#16A085]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
              Required Experience Level *
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-4 py-3 text-sm text-[#3B3028] focus:outline-none focus:border-[#16A085]"
            >
              <option value="Entry Level">Entry Level</option>
              <option value="Intermediate">Intermediate (Recommended)</option>
              <option value="Expert">Expert / Architect</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
            Detailed Project Description & Scope *
          </label>
          <textarea
            required
            rows={6}
            placeholder="Describe your goals, tech stack preferences, deliverables, key milestones, and timeline expectations..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl p-4 text-sm text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085] shadow-inner leading-relaxed resize-none"
          />
        </div>

        {/* Skills Tag Input */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
            Required Skills (Press Enter to add) *
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. Next.js, Python, Figma, Kubernetes"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              className="flex-1 bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-4 py-2.5 text-sm text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085]"
            />
            <button
              type="button"
              onClick={(e) => {
                if (skillInput.trim()) {
                  handleAddSkill({ key: 'Enter', preventDefault: () => {} });
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-[#F4E8D5] hover:bg-[#E5D7C5] text-xs font-bold text-[#3B3028] transition-colors"
            >
              Add Skill
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {skillsRequired.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F4E8D5] text-xs font-semibold text-[#3B3028] border border-[#E5D7C5]"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-[#75685C] hover:text-[#c26547]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Budget and Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#E5D7C5]">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
              Budget Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBudgetType('fixed')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  budgetType === 'fixed'
                    ? 'bg-[#16A085] text-white border-[#16A085]'
                    : 'bg-[#FFFDF8] text-[#75685C] border-[#E5D7C5]'
                }`}
              >
                Fixed Price
              </button>
              <button
                type="button"
                onClick={() => setBudgetType('hourly')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  budgetType === 'hourly'
                    ? 'bg-[#16A085] text-white border-[#16A085]'
                    : 'bg-[#FFFDF8] text-[#75685C] border-[#E5D7C5]'
                }`}
              >
                Hourly Rate
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
              Budget Amount (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-[#16A085] font-bold">₹</span>
              <input
                type="number"
                required
                min="100"
                placeholder="45000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl pl-8 pr-4 py-2.5 text-sm text-[#3B3028] font-bold focus:outline-none focus:border-[#16A085]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
              Estimated Duration
            </label>
            <input
              type="text"
              placeholder="e.g. 2 to 4 weeks"
              value={projectDuration}
              onChange={(e) => setProjectDuration(e.target.value)}
              className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-4 py-2.5 text-sm text-[#3B3028] focus:outline-none focus:border-[#16A085]"
            />
          </div>
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#F4E8D5]/60 border border-[#E5D7C5]">
          <input
            type="checkbox"
            id="featured"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-4 h-4 accent-[#16A085] rounded cursor-pointer"
          />
          <label htmlFor="featured" className="text-xs text-[#3B3028] font-semibold cursor-pointer">
            Highlight as Featured Project (Attracts 3x more senior proposals)
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#E5D7C5]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl text-xs font-bold text-[#75685C] hover:text-[#3B3028] hover:bg-[#F4E8D5] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-3 px-8 text-sm font-bold shadow-warm-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{loading ? 'Publishing...' : 'Publish Project'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default PostJobPage;
