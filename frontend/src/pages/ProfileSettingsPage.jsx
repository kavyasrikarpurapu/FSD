import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Save, CheckCircle2, AlertCircle, Plus, Trash2, Globe, Github, Linkedin, Briefcase, Sparkles, RefreshCw } from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&auto=format&fit=crop&q=80'
];

const ProfileSettingsPage = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [title, setTitle] = useState(user?.title || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [hourlyRate, setHourlyRate] = useState(user?.hourlyRate || 1500);
  const [category, setCategory] = useState(user?.category || 'Web Development');
  const [skills, setSkills] = useState(user?.skills ? user.skills.join(', ') : '');
  const [location, setLocation] = useState(user?.location || 'Remote');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user?.linkedinUrl || '');
  const [websiteUrl, setWebsiteUrl] = useState(user?.websiteUrl || '');

  // Portfolio list
  const [portfolio, setPortfolio] = useState(user?.portfolio || []);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleAddPortfolio = () => {
    setPortfolio([
      ...portfolio,
      {
        title: 'New Showcase Project',
        description: 'Project details and tech stack used...',
        link: 'https://github.com',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
        tags: ['React', 'Tailwind CSS']
      }
    ]);
  };

  const handleRemovePortfolio = (index) => {
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  const handlePortfolioChange = (index, field, value) => {
    const updated = [...portfolio];
    if (field === 'tags') {
      updated[index].tags = value.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      updated[index][field] = value;
    }
    setPortfolio(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    try {
      const res = await updateProfile({
        name,
        avatar,
        title,
        bio,
        hourlyRate: Number(hourlyRate),
        category,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        location,
        companyName,
        githubUrl,
        linkedinUrl,
        websiteUrl,
        portfolio
      });

      if (res.success) {
        setSuccess('Profile updated successfully!');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-1 border-b border-[#E5D7C5] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A085]/10 text-[#12806A] text-xs font-bold border border-[#16A085]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#16A085]" />
          <span>Account & Identity Settings</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#3B3028] font-display">Profile Settings</h1>
        <p className="text-xs sm:text-sm text-[#75685C]">
          Update your public profile, rates, skills, portfolio showcases, and social links.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-[#e8f8f5] border border-[#16A085]/40 flex items-center gap-3 text-xs text-[#12806A] font-semibold">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#16A085]" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-[#faece5] border border-[#f6d9cd] flex items-center gap-3 text-xs text-[#c26547]">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl p-6 sm:p-10 shadow-warm-xl space-y-8">
        
        {/* Avatar Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
            Profile Avatar
          </label>
          <div className="flex flex-wrap items-center gap-4">
            <img
              src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
              alt={name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#16A085] bg-[#F4E8D5] shadow-sm"
            />
            <div className="flex-1 min-w-[200px] space-y-2">
              <input
                type="url"
                placeholder="Enter custom image URL"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3.5 py-2 text-xs text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085]"
              />
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#75685C]">Quick Presets:</span>
                {PRESET_AVATARS.map((pImg, idx) => (
                  <img
                    key={idx}
                    src={pImg}
                    alt="Preset"
                    onClick={() => setAvatar(pImg)}
                    className="w-6 h-6 rounded-lg object-cover cursor-pointer hover:scale-110 transition-transform border border-[#E5D7C5]"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E5D7C5]">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
              Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3.5 py-2 text-sm text-[#3B3028] focus:outline-none focus:border-[#16A085]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
              Professional Title
            </label>
            <input
              type="text"
              placeholder="e.g. Lead Full-Stack Architect"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3.5 py-2 text-sm text-[#3B3028] focus:outline-none focus:border-[#16A085]"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
            Bio & Introduction
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Introduce yourself, your accomplishments, work philosophy, and areas of excellence..."
            className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl p-3.5 text-sm text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085] resize-none leading-relaxed"
          />
        </div>

        {/* Rate, Category, Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#E5D7C5]">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
              Hourly Rate (₹/hr)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2 text-[#16A085] font-bold">₹</span>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl pl-8 pr-3 py-2 text-sm text-[#3B3028] focus:outline-none focus:border-[#16A085]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3.5 py-2 text-sm text-[#3B3028] focus:outline-none focus:border-[#16A085]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
              Location
            </label>
            <input
              type="text"
              placeholder="e.g. Bangalore, India"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3.5 py-2 text-sm text-[#3B3028] focus:outline-none focus:border-[#16A085]"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
            Skills (comma separated)
          </label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="React 19, Next.js, Node.js, AI Agents, Python"
            className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3.5 py-2 text-sm text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085]"
          />
        </div>

        {/* Portfolio Section */}
        <div className="space-y-4 pt-4 border-t border-[#E5D7C5]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
              Portfolio & Past Showcases
            </label>
            <button
              type="button"
              onClick={handleAddPortfolio}
              className="text-xs font-bold text-[#16A085] hover:text-[#12806A] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Showcase
            </button>
          </div>

          <div className="space-y-4">
            {portfolio.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#F4E8D5]/60 border border-[#E5D7C5] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#3B3028]">Showcase #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePortfolio(idx)}
                    className="text-[#75685C] hover:text-[#c26547]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={item.title}
                    onChange={(e) => handlePortfolioChange(idx, 'title', e.target.value)}
                    className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3 py-1.5 text-xs text-[#3B3028]"
                  />
                  <input
                    type="url"
                    placeholder="Project URL / Repo Link"
                    value={item.link}
                    onChange={(e) => handlePortfolioChange(idx, 'link', e.target.value)}
                    className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3 py-1.5 text-xs text-[#3B3028]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#E5D7C5]">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-3 px-8 text-sm font-bold shadow-warm-md"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Profile...' : 'Save Changes'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default ProfileSettingsPage;
