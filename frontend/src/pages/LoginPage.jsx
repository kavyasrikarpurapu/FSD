import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Lock, Mail, Sparkles, ArrowRight, AlertCircle, ShieldCheck, CheckCircle2, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'client') {
        navigate('/client/dashboard');
      } else {
        navigate('/freelancer/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (role) => {
    setError('');
    setLoading(true);
    try {
      const user = await demoLogin(role);
      if (user.role === 'client') {
        navigate('/client/dashboard');
      } else {
        navigate('/freelancer/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  const [customApiUrl, setCustomApiUrl] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  const handleSaveApiUrl = (e) => {
    e.preventDefault();
    if (!customApiUrl) return;
    const clean = customApiUrl.trim().replace(/\/+$/, '');
    localStorage.setItem('VITE_API_URL', clean.endsWith('/api') ? clean : `${clean}/api`);
    setShowConfig(false);
    setError('Backend URL updated! Please sign in or use 1-click login now.');
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
      <div className="bg-[#FFFDF8] border border-[#E5D7C5] rounded-3xl w-full max-w-4xl shadow-warm-xl grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        
        {/* Left Side: Form Container */}
        <div className="md:col-span-7 p-8 sm:p-12 space-y-6 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="space-y-2 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16A085]/10 text-[#12806A] text-xs font-bold border border-[#16A085]/20">
                <Sparkles className="w-3.5 h-3.5 text-[#16A085]" />
                <span>Verified Escrow Platform</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#3B3028] font-display">
                Sign In to FreelanceHub
              </h1>
              <p className="text-xs sm:text-sm text-[#75685C]">
                Enter your credentials or use the 1-click demo login below.
              </p>
            </div>

            {/* 1-Click Fast Demo Logins */}
            <div className="space-y-2 p-4 rounded-2xl bg-[#F4E8D5]/60 border border-[#E5D7C5]">
              <span className="text-[11px] font-bold uppercase text-[#75685C] tracking-wider block">
                1-Click Fast Demo Login
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoClick('client')}
                  disabled={loading}
                  className="py-2.5 px-3 rounded-xl bg-[#16A085] hover:bg-[#12806A] text-white text-xs font-bold transition-all shadow-sm"
                >
                  Sign in as Client
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoClick('freelancer')}
                  disabled={loading}
                  className="py-2.5 px-3 rounded-xl bg-[#D97757] hover:bg-[#c26547] text-white text-xs font-bold transition-all shadow-sm"
                >
                  Sign in as Freelancer
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3.5 rounded-xl bg-[#faece5] border border-[#f6d9cd] space-y-2 text-xs text-[#c26547]">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
                {(error.includes('405') || error.includes('Backend') || error.includes('backend') || error.includes('connect')) && (
                  <div className="pt-2 border-t border-[#f6d9cd]/80">
                    {!showConfig ? (
                      <button
                        type="button"
                        onClick={() => setShowConfig(true)}
                        className="font-bold underline text-[#c26547] hover:text-[#a04e33]"
                      >
                        Click here to enter your live Render backend URL
                      </button>
                    ) : (
                      <div className="flex gap-2 mt-1.5">
                        <input
                          type="text"
                          placeholder="https://your-backend.onrender.com"
                          value={customApiUrl}
                          onChange={(e) => setCustomApiUrl(e.target.value)}
                          className="flex-1 bg-white border border-[#E5D7C5] rounded-lg px-2.5 py-1 text-xs text-[#3B3028] placeholder-[#9C8E80] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleSaveApiUrl}
                          className="px-3 py-1 bg-[#16A085] hover:bg-[#12806A] text-white font-bold rounded-lg text-xs"
                        >
                          Save & Retry
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#75685C] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. client@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#3B3028] uppercase tracking-wider font-display">
                    Password
                  </label>
                  <span className="text-[11px] text-[#16A085] hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#75685C] absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#FFFDF8] border border-[#E5D7C5] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#3B3028] placeholder-[#9C8E80] focus:outline-none focus:border-[#16A085]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-sm font-bold shadow-warm-md"
              >
                <span>{loading ? 'Signing In...' : 'Sign In to Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="pt-6 border-t border-[#E5D7C5] text-center text-xs text-[#75685C]">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#16A085] hover:underline">
              Create an Account
            </Link>
          </div>
        </div>

        {/* Right Side: Editorial Showcase Panel */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#F4E8D5] via-[#FFFDF8] to-[#F8EFE2] p-8 sm:p-10 border-t md:border-t-0 md:border-l border-[#E5D7C5] flex flex-col justify-between">
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#16A085] via-[#12806A] to-[#D6A85F] flex items-center justify-center shadow-warm-sm">
              <Briefcase className="w-6 h-6 text-white" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#3B3028] font-display">
                Empowering the World's Best Talent
              </h3>
              <p className="text-xs text-[#75685C] leading-relaxed">
                Connect with elite clients, deliver cutting-edge engineering milestones, and enjoy guaranteed escrow settlements.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-[#3B3028] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#16A085] flex-shrink-0" />
                <span>100% Escrow Protection on every milestone</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#3B3028] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#16A085] flex-shrink-0" />
                <span>Direct client messaging & file submissions</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#3B3028] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#16A085] flex-shrink-0" />
                <span>Transparent reviews stored in cloud database</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#E5D7C5] shadow-sm mt-6">
            <div className="flex items-center gap-1 text-[#D6A85F] text-xs font-bold mb-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>4.98 Rating across 1,200+ completed projects</span>
            </div>
            <p className="text-[11px] text-[#75685C]">
              "FreelanceHub provides the most seamless escrow payments and verified talent directory."
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
