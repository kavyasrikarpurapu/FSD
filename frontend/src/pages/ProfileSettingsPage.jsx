import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Save, CheckCircle2, AlertCircle, Plus, Trash2, Globe, Github, Linkedin, Briefcase } from 'lucide-react';

const ProfileSettingsPage = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [title, setTitle] = useState(user?.title || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [hourlyRate, setHourlyRate] = useState(user?.hourlyRate || 50);
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
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      await updateProfile({
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
      setSuccess('Profile successfully updated in MongoDB Atlas!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Account Preferences</span>
        <h1 className="text-3xl font-extrabold text-white mt-1">Profile & Portfolio Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Update your public presence, verified skills, and showcase work</p>
      </div>

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-3 text-xs text-emerald-300">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center gap-3 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
        
        {/* Avatar & Basic Info */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800">
          <img
            src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'user'}`}
            alt="Avatar"
            className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40"
          />
          <div className="flex-1 w-full space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Avatar Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Name & Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Professional Title / Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Professional Bio & About</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Rates & Skills */}
        {user?.role === 'freelancer' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Hourly Rate ($/hr)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Skills (comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Portfolio Section for Freelancers */}
        {user?.role === 'freelancer' && (
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Showcase Portfolio Projects</h3>
                <p className="text-xs text-slate-400">Add live samples to increase your hire probability</p>
              </div>
              <button
                type="button"
                onClick={handleAddPortfolio}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>

            <div className="space-y-4">
              {portfolio.map((item, idx) => (
                <div key={idx} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300">Project #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePortfolio(idx)}
                      className="text-slate-400 hover:text-red-400"
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
                      className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={item.imageUrl || ''}
                      onChange={(e) => handlePortfolioChange(idx, 'imageUrl', e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Short description"
                    value={item.description}
                    onChange={(e) => handlePortfolioChange(idx, 'description', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-glow transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Changes...' : 'Save Profile Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default ProfileSettingsPage;
