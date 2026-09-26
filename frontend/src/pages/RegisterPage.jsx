import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, User, Mail, Lock, Sparkles, ArrowRight, AlertCircle, Building, CheckCircle2, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [role, setRole] = useState('freelancer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [title, setTitle] = useState('');
  const [hourlyRate, setHourlyRate] = useState('1500');
  const [skills, setSkills] = useState('React 19, Tailwind CSS, Node.js, AI Agents');
  const [category, setCategory] = useState('Web Development');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name,
        email,
        password,
        role,
        companyName: role === 'client' ? companyName : undefined,
        title: role === 'freelancer' ? title : 'Client & Project Owner',
        hourlyRate: role === 'freelancer' ? Number(hourlyRate) : undefined,
        skills: role === 'freelancer' ? skills.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        category
      });

      if (user.role === 'client') {
        navigate('/client/dashboard');
      } else {
        navigate('/freelancer/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl w-full max-w-4xl shadow-warm-xl grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        
        {/* Left Side: Registration Form */}
        <div className="md:col-span-7 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
          <div>
            <div className="space-y-1.5 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A085]/10 text-[#12806A] text-xs font-bold border border-[#16A085]/20">
                <Sparkles className="w-3.5 h-3.5 text-[#16A085]" />
                <span>Join Global Talent Marketplace</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#3B3028] font-display">
                Create Your Account
              </h1>
              <p className="text-xs sm:text-sm text-[#75685C]">
                Get started as a hiring client or elite freelance professional.
              </p>
            </div>

            {/* Role Selection Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#F4E8D5] border border-[#E5D7C5] mb-6">
              <button
                type="button"
                onClick={() => setRole('freelancer')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  role === 'freelancer'
                    ? 'bg-[#16A085] text-white shadow-sm'
                    : 'text-[#75685C] hover:text-[#3B3028]'
                }`}
              >
                <User className="w-4 h-4" />
                <span>I'm a Freelancer</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  role === 'client'
                    ? 'bg-[#D97757] text-white shadow-sm'
                    : 'text-[#75685C] hover:text-[#3B3028]'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>I'm a Client</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-[#faece5] border border-[#f6d9cd] flex items-center gap-2.5 text-xs text-[#c26547]">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3.5 py-2 text-sm text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. priya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3.5 py-2 text-sm text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
                  Password (6+ characters) *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3.5 py-2 text-sm text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085]"
                />
              </div>

              {role === 'client' ? (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
                    Company / Organization Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Innovations Corp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3.5 py-2 text-sm text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#D97757]"
                  />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
                        Professional Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lead Full-Stack Architect"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3.5 py-2 text-sm text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
                        Hourly Rate (₹/hr)
                      </label>
                      <input
                        type="number"
                        placeholder="1500"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3.5 py-2 text-sm text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
                      Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="React, Next.js, Node.js, AI Agents, Python"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl px-3.5 py-2 text-sm text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085]"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm font-bold shadow-warm-md mt-2"
              >
                <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-[#E5D7C5] text-center text-xs text-[#75685C]">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#16A085] hover:underline">
              Log In
            </Link>
          </div>
        </div>

        {/* Right Side: Editorial Benefit Showcase */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#F4E8D5] via-[#FFFDF8] to-[#F8EFE2] p-8 sm:p-10 border-t md:border-t-0 md:border-l border-[#E5D7C5] flex flex-col justify-between">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#16A085] via-[#12806A] to-[#D6A85F] flex items-center justify-center shadow-warm-sm">
              <Briefcase className="w-6 h-6 text-white" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#3B3028] font-display">
                {role === 'freelancer' ? 'Grow Your Consulting Career' : 'Hire Top 1% Global Engineers'}
              </h3>
              <p className="text-xs text-[#75685C] leading-relaxed">
                {role === 'freelancer'
                  ? 'Access high-budget milestone projects with guaranteed escrow deposits and direct client messaging.'
                  : 'Post project milestones, receive tailored proposals from vetted talent, and release funds upon review.'}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-[#3B3028] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#16A085] flex-shrink-0" />
                <span>Zero platform risk with milestone escrows</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#3B3028] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#16A085] flex-shrink-0" />
                <span>Verified ratings & reputation system</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#3B3028] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#16A085] flex-shrink-0" />
                <span>Seamless file deliverables & instant payouts</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E5D7C5] shadow-sm mt-6">
            <div className="flex items-center gap-1 text-[#D6A85F] text-xs font-bold mb-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Enterprise Grade Security</span>
            </div>
            <p className="text-[11px] text-[#75685C]">
              Backed by encrypted JWT authentication and persistent MongoDB Atlas cloud database.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
