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
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  FolderGit2,
  HelpCircle,
  Globe
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
    <header className="sticky top-0 z-50 bg-[#FFFDF8]/90 backdrop-blur-xl border-b border-[#E5D7C5] shadow-warm-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#16A085] via-[#12806A] to-[#D6A85F] flex items-center justify-center shadow-warm-md group-hover:scale-105 transition-transform duration-300">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-[#3B3028] flex items-center gap-1 font-display">
                Freelance<span className="text-[#16A085]">Hub</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#75685C] -mt-1">
                Verified Escrow Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/freelancers"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive('/freelancers')
                  ? 'bg-[#16A085]/10 text-[#16A085] border border-[#16A085]/20'
                  : 'text-[#75685C] hover:text-[#3B3028] hover:bg-[#F4E8D5]/60'
              }`}
            >
              Find Talent
            </Link>

            <Link
              to="/jobs"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive('/jobs')
                  ? 'bg-[#16A085]/10 text-[#16A085] border border-[#16A085]/20'
                  : 'text-[#75685C] hover:text-[#3B3028] hover:bg-[#F4E8D5]/60'
              }`}
            >
              Find Work
            </Link>

            <Link
              to="/jobs"
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-[#75685C] hover:text-[#3B3028] hover:bg-[#F4E8D5]/60 transition-all duration-200"
            >
              Projects
            </Link>

            <a
              href="#how-it-works"
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-[#75685C] hover:text-[#3B3028] hover:bg-[#F4E8D5]/60 transition-all duration-200"
            >
              How It Works
            </a>

            <a
              href="#community"
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-[#75685C] hover:text-[#3B3028] hover:bg-[#F4E8D5]/60 transition-all duration-200"
            >
              Community
            </a>

            {user && (
              <>
                <Link
                  to={isClient ? '/client/dashboard' : '/freelancer/dashboard'}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive('/client/dashboard') || isActive('/freelancer/dashboard')
                      ? 'bg-[#16A085]/10 text-[#16A085] border border-[#16A085]/20'
                      : 'text-[#75685C] hover:text-[#3B3028] hover:bg-[#F4E8D5]/60'
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  to="/contracts"
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive('/contracts')
                      ? 'bg-[#16A085]/10 text-[#16A085] border border-[#16A085]/20'
                      : 'text-[#75685C] hover:text-[#3B3028] hover:bg-[#F4E8D5]/60'
                  }`}
                >
                  Contracts
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <div className="flex items-center gap-2.5">
                {/* 1-Click Fast Demo Switcher */}
                <div className="flex items-center bg-[#F4E8D5] rounded-xl p-1 border border-[#E5D7C5] shadow-inner text-xs">
                  <span className="text-[#75685C] px-2 flex items-center gap-1 font-semibold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-[#D97757]" /> Demo:
                  </span>
                  <button
                    onClick={() => handleDemoLogin('client')}
                    disabled={loggingInDemo}
                    className="px-2.5 py-1 rounded-lg bg-[#16A085] hover:bg-[#12806A] text-white font-semibold transition-all text-xs shadow-sm"
                    title="1-Click Login as Client"
                  >
                    Client
                  </button>
                  <button
                    onClick={() => handleDemoLogin('freelancer')}
                    disabled={loggingInDemo}
                    className="px-2.5 py-1 rounded-lg bg-[#D97757] hover:bg-[#c26547] text-white font-semibold ml-1 transition-all text-xs shadow-sm"
                    title="1-Click Login as Freelancer"
                  >
                    Freelancer
                  </button>
                </div>

                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#3B3028] hover:text-[#16A085] transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary py-2 px-5 text-xs shadow-warm-md"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                {isClient && (
                  <Link
                    to="/post-job"
                    className="btn-primary py-2 px-4 text-xs shadow-warm-md"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post Job</span>
                  </Link>
                )}

                {/* Direct Messages */}
                <Link
                  to="/messages"
                  className="p-2.5 rounded-xl text-[#75685C] hover:text-[#16A085] hover:bg-[#F4E8D5]/70 transition-all relative border border-[#E5D7C5] bg-[#FFFDF8]"
                  title="Direct Messages"
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                </Link>

                {/* Notifications Bell */}
                <div className="relative" ref={notifMenuRef}>
                  <button
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    className="p-2.5 rounded-xl text-[#75685C] hover:text-[#16A085] hover:bg-[#F4E8D5]/70 transition-all relative border border-[#E5D7C5] bg-[#FFFDF8]"
                  >
                    <Bell className="w-4.5 h-4.5" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#D97757] rounded-full ring-2 ring-[#FFFDF8] animate-pulse" />
                    )}
                  </button>

                  {/* Dropdown */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#FFFDF8] border border-[#E5D7C5] shadow-warm-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2.5 border-b border-[#E5D7C5] flex items-center justify-between">
                        <span className="font-bold text-sm text-[#3B3028]">Notifications</span>
                        {unreadNotificationsCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-[#16A085] hover:text-[#12806A] font-semibold"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-[#F4E8D5]">
                        {notifications.length === 0 ? (
                          <div className="p-5 text-center text-xs text-[#75685C]">
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
                              className={`p-3 text-xs hover:bg-[#F8EFE2] cursor-pointer transition-colors ${
                                !n.read ? 'bg-[#FFF9F0]' : ''
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read ? 'bg-[#16A085]' : 'bg-transparent'}`} />
                                <div>
                                  <p className="text-[#3B3028] font-medium leading-snug">{n.message}</p>
                                  <span className="text-[10px] text-[#9C8E80] mt-1 block">
                                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-[#FFFDF8] hover:bg-[#F8EFE2] border border-[#E5D7C5] transition-all"
                  >
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-xl object-cover border border-[#E5D7C5]"
                    />
                    <div className="text-left hidden sm:block">
                      <p className="text-xs font-bold text-[#3B3028] truncate max-w-[100px] leading-tight">
                        {user.name}
                      </p>
                      <p className="text-[10px] font-semibold text-[#16A085] capitalize leading-none">
                        {user.role}
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#75685C]" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#FFFDF8] border border-[#E5D7C5] shadow-warm-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-[#E5D7C5]">
                        <p className="text-xs font-bold text-[#3B3028] truncate">{user.name}</p>
                        <p className="text-[11px] text-[#75685C] truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to={isClient ? '/client/dashboard' : '/freelancer/dashboard'}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#3B3028] hover:bg-[#F8EFE2] hover:text-[#16A085] transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#75685C]" />
                          <span>Dashboard</span>
                        </Link>

                        <Link
                          to="/contracts"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#3B3028] hover:bg-[#F8EFE2] hover:text-[#16A085] transition-colors"
                        >
                          <FileText className="w-4 h-4 text-[#75685C]" />
                          <span>My Contracts</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#3B3028] hover:bg-[#F8EFE2] hover:text-[#16A085] transition-colors"
                        >
                          <User className="w-4 h-4 text-[#75685C]" />
                          <span>Profile Settings</span>
                        </Link>
                      </div>

                      <div className="pt-1 border-t border-[#E5D7C5]">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#c26547] hover:bg-[#faece5] transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {!user && (
              <div className="flex items-center gap-1 bg-[#F4E8D5] p-1 rounded-xl border border-[#E5D7C5]">
                <button
                  onClick={() => handleDemoLogin('client')}
                  className="px-2 py-0.5 rounded-lg bg-[#16A085] text-white text-[10px] font-bold"
                >
                  Client
                </button>
                <button
                  onClick={() => handleDemoLogin('freelancer')}
                  className="px-2 py-0.5 rounded-lg bg-[#D97757] text-white text-[10px] font-bold"
                >
                  Freelancer
                </button>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#3B3028] hover:bg-[#F4E8D5] border border-[#E5D7C5]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5D7C5] bg-[#FFFDF8] px-4 pt-3 pb-6 space-y-3 shadow-warm-xl">
          <nav className="flex flex-col space-y-1">
            <Link
              to="/freelancers"
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-[#3B3028] hover:bg-[#F4E8D5]"
            >
              Find Talent
            </Link>
            <Link
              to="/jobs"
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-[#3B3028] hover:bg-[#F4E8D5]"
            >
              Find Work
            </Link>
            <Link
              to="/jobs"
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-[#3B3028] hover:bg-[#F4E8D5]"
            >
              Projects
            </Link>

            {user ? (
              <>
                <Link
                  to={isClient ? '/client/dashboard' : '/freelancer/dashboard'}
                  className="px-3 py-2.5 rounded-xl text-sm font-semibold text-[#3B3028] hover:bg-[#F4E8D5]"
                >
                  Dashboard
                </Link>
                <Link
                  to="/contracts"
                  className="px-3 py-2.5 rounded-xl text-sm font-semibold text-[#3B3028] hover:bg-[#F4E8D5]"
                >
                  Contracts
                </Link>
                <Link
                  to="/messages"
                  className="px-3 py-2.5 rounded-xl text-sm font-semibold text-[#3B3028] hover:bg-[#F4E8D5]"
                >
                  Messages
                </Link>
                <Link
                  to="/profile"
                  className="px-3 py-2.5 rounded-xl text-sm font-semibold text-[#3B3028] hover:bg-[#F4E8D5]"
                >
                  Profile Settings
                </Link>
                {isClient && (
                  <Link
                    to="/post-job"
                    className="btn-primary w-full py-2.5 mt-2 text-xs"
                  >
                    Post a Project
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-[#c26547] hover:bg-[#faece5]"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="pt-3 border-t border-[#E5D7C5] space-y-2">
                <Link
                  to="/login"
                  className="block w-full py-2.5 text-center rounded-xl bg-[#F4E8D5] text-sm font-semibold text-[#3B3028]"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary block w-full py-2.5 text-center text-sm font-semibold text-white"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
