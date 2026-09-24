import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, 
  Users, 
  PlusCircle, 
  MessageSquare, 
  Bell, 
  User, 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  ChevronDown, 
  Sparkles,
  Menu,
  X,
  CheckCircle2
} from 'lucide-react';
import api from '../../services/api';

const Navbar = () => {
  const { user, logout, isClient, isFreelancer, demoLogin, notifications, unreadNotificationsCount, fetchNotifications } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingInDemo, setLoggingInDemo] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setNotifDropdownOpen(false);
  }, [location.pathname]);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all/all');
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDemoLogin = async (role) => {
    setLoggingInDemo(true);
    try {
      await demoLogin(role);
      navigate(role === 'client' ? '/client/dashboard' : '/freelancer/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoggingInDemo(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-glow">
              <Briefcase className="w-5 h-5 text-white transform group-hover:rotate-6 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-white flex items-center gap-1">
                Freelance<span className="text-indigo-400">Hub</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-300/80 -mt-1">
                Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/jobs"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/jobs')
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Browse Jobs
            </Link>

            <Link
              to="/freelancers"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/freelancers')
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Find Talent
            </Link>

            {user && (
              <>
                <Link
                  to={isClient ? '/client/dashboard' : '/freelancer/dashboard'}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/client/dashboard') || isActive('/freelancer/dashboard')
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  to="/contracts"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive('/contracts')
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Contracts
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Switcher if not logged in */}
            {!user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700/60 text-xs">
                  <span className="text-slate-400 px-2 flex items-center gap-1 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Demo:
                  </span>
                  <button
                    onClick={() => handleDemoLogin('client')}
                    disabled={loggingInDemo}
                    className="px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-medium transition-colors"
                    title="1-Click Login as Client"
                  >
                    Client
                  </button>
                  <button
                    onClick={() => handleDemoLogin('freelancer')}
                    disabled={loggingInDemo}
                    className="px-2.5 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 font-medium ml-1 transition-colors"
                    title="1-Click Login as Freelancer"
                  >
                    Freelancer
                  </button>
                </div>

                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-glow transition-all"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Client Post Job Button */}
                {isClient && (
                  <Link
                    to="/post-job"
                    className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-glow transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post a Job</span>
                  </Link>
                )}

                {/* Messages Link */}
                <Link
                  to="/messages"
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
                  title="Direct Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>

                {/* Notifications Bell */}
                <div className="relative" ref={notifMenuRef}>
                  <button
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-pink-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 rounded-xl glass-dropdown shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                        <span className="font-semibold text-sm text-white">Notifications</span>
                        {unreadNotificationsCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => {
                                setNotifDropdownOpen(false);
                                if (n.link) navigate(n.link);
                              }}
                              className={`p-3 text-xs hover:bg-slate-800/80 cursor-pointer transition-colors ${
                                !n.read ? 'bg-indigo-950/30' : ''
                              }`}
                            >
                              <p className="font-semibold text-slate-200">{n.title}</p>
                              <p className="text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                              <span className="text-[10px] text-slate-500 mt-1 block">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-indigo-500/40 object-cover"
                    />
                    <div className="hidden lg:flex flex-col text-left">
                      <span className="text-xs font-semibold text-white leading-tight">{user.name}</span>
                      <span className="text-[10px] capitalize text-indigo-400 font-medium">{user.role}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl glass-dropdown shadow-2xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-800">
                        <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {user.role} Account
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to={isClient ? '/client/dashboard' : '/freelancer/dashboard'}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80"
                        >
                          <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                          Dashboard
                        </Link>
                        {isFreelancer && (
                          <Link
                            to={`/freelancers/${user._id}`}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80"
                          >
                            <User className="w-4 h-4 text-cyan-400" />
                            View Public Profile
                          </Link>
                        )}
                        <Link
                          to="/contracts"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80"
                        >
                          <FileText className="w-4 h-4 text-emerald-400" />
                          My Contracts
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80"
                        >
                          <User className="w-4 h-4 text-amber-400" />
                          Edit Profile & Settings
                        </Link>
                      </div>

                      <div className="border-t border-slate-800 pt-1">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/jobs"
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Browse Jobs
          </Link>
          <Link
            to="/freelancers"
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Find Talent
          </Link>

          {user ? (
            <>
              <Link
                to={isClient ? '/client/dashboard' : '/freelancer/dashboard'}
                className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-400 hover:bg-slate-800"
              >
                Dashboard
              </Link>
              {isClient && (
                <Link
                  to="/post-job"
                  className="block px-3 py-2 rounded-lg text-base font-medium text-cyan-400 hover:bg-slate-800"
                >
                  Post a Job
                </Link>
              )}
              <Link
                to="/contracts"
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                My Contracts
              </Link>
              <Link
                to="/messages"
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Messages
              </Link>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Profile Settings
              </Link>
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:bg-red-950/30"
              >
                Log Out ({user.name})
              </button>
            </>
          ) : (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => handleDemoLogin('client')}
                  className="px-3 py-2 rounded-lg bg-indigo-600/30 text-indigo-300 text-xs font-semibold"
                >
                  Demo Client
                </button>
                <button
                  onClick={() => handleDemoLogin('freelancer')}
                  className="px-3 py-2 rounded-lg bg-cyan-600/30 text-cyan-300 text-xs font-semibold"
                >
                  Demo Freelancer
                </button>
              </div>
              <Link
                to="/login"
                className="block w-full text-center py-2.5 rounded-lg border border-slate-700 text-slate-200 font-medium"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="block w-full text-center py-2.5 rounded-lg bg-indigo-600 text-white font-medium"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
