import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import {
  ShieldCheck,
  Bell,
  Wifi,
  WifiOff,
  ChevronDown,
  Sparkles,
  Globe,
  Award,
  Layers,
  GraduationCap,
  Briefcase,
  BarChart3,
  PlusCircle,
  FileCheck
} from "lucide-react";
import { useT } from '../../i18n/useT';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    allUsers,
    switchUser,
    notifications,
    markNotificationAsRead,
    isOnline,
    offlineQueue,
    currentLanguage,
    setCurrentLanguage,
    setChatbotOpen
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const location = useLocation();

  const unreadNotifs = notifications.filter((n) => n.status !== "read");

  const { t } = useT();

  const navLinks = [
    { name: t('nav_home'), path: '/', icon: Layers },
    { name: t('nav_submit'), path: '/submit', icon: PlusCircle },
    { name: t('nav_my_problems'), path: '/my-problems', icon: FileCheck },
    { name: t('nav_hei_workspace'), path: '/hei/dashboard', icon: GraduationCap },
    { name: t('nav_industry'), path: '/industry/marketplace', icon: Briefcase },
    { name: t('nav_govt'), path: '/govt/dashboard', icon: BarChart3 },
    { name: t('nav_leaderboard'), path: '/leaderboard', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Official Govt Strip */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-dot inline-block"></span>
            <span>{t('home_govt_strip')}</span>
          </span>
          <span className="text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-300">
            {t('home_dept_strip')}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Offline/Online Indicator */}
          <div className="flex items-center space-x-1.5">
            {isOnline ? (
              <span className="flex items-center space-x-1 text-emerald-400 text-xs">
                <Wifi className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{t('nav_online')}</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-amber-400 text-xs font-semibold">
                <WifiOff className="w-3.5 h-3.5" />
                <span>{t('nav_offline')} ({offlineQueue.length} {t('nav_queued')})</span>
              </span>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-xs text-slate-200"
            >
              <Globe className="w-3 h-3 text-emerald-400" />
              <span className="uppercase font-mono">{currentLanguage}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 mt-1 w-36 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1 z-50">
                <button
                  onClick={() => { setCurrentLanguage("en"); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 ${currentLanguage === "en" ? "font-bold text-emerald-700 bg-emerald-50" : ""}`}
                >
                  English
                </button>
                <button
                  onClick={() => { setCurrentLanguage("hi"); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 ${currentLanguage === "hi" ? "font-bold text-emerald-700 bg-emerald-50" : ""}`}
                >
                  हिन्दी (Hindi)
                </button>
                <button
                  onClick={() => { setCurrentLanguage("nagpuri"); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 ${currentLanguage === "nagpuri" ? "font-bold text-emerald-700 bg-emerald-50" : ""}`}
                >
                  नागपुरी (Nagpuri)
                </button>
                <button
                  onClick={() => { setCurrentLanguage("santali"); setLangDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 ${currentLanguage === "santali" ? "font-bold text-emerald-700 bg-emerald-50" : ""}`}
                >
                  संताली (Santali)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Identity */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-lg tracking-wider">JS</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-extrabold text-xl text-slate-900 tracking-tight">
                  JSICP
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide border border-emerald-300">
                  JHARKHAND
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Societal Innovation Collaboration Portal
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Hub: AI Chatbot, Notifications, Persona Switcher */}
          <div className="flex items-center space-x-3">
            {/* AI Sahayak Assistant Trigger */}
            <button
              onClick={() => setChatbotOpen(true)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Sahayak</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-heading font-bold text-sm text-slate-800">
                      Multi-Channel Notifications
                    </span>
                    <span className="text-xs text-slate-500">{notifications.length} updates</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition ${
                          n.status !== "read" ? "bg-emerald-50/50" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-800">{n.title}</span>
                          <span className="uppercase text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                            {n.channel}
                          </span>
                        </div>
                        <p className="text-slate-600 line-clamp-2">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(n.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-slate-100 text-center">
                    <Link
                      to="/notifications"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      View All Notifications & SMS Dispatches →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Persona Switcher (Crucial for SIH Demo & Evaluation) */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1.5 rounded-xl transition"
              >
                <img
                  src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                  alt={currentUser.fullName}
                  className="w-7 h-7 rounded-full object-cover border border-emerald-500"
                />
                <div className="text-left hidden md:block">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[110px]">
                      {currentUser.fullName}
                    </span>
                    {currentUser.aadhaarVerified && (
                      <span title="DigiLocker / Aadhaar eKYC Verified"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /></span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium block truncate max-w-[120px]">
                    {currentUser.roleTitle}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70 rounded-t-xl">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      ⚡ Quick Role / Persona Switcher
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Instantly test the platform from any user perspective:
                    </p>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 py-1">
                    {Object.values(allUsers).map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 flex items-start space-x-3 hover:bg-emerald-50/70 transition ${
                          u.id === currentUser.id ? "bg-emerald-50 border-l-4 border-emerald-600" : ""
                        }`}
                      >
                        <img
                          src={u.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                          alt={u.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {u.fullName}
                            </span>
                            {u.aadhaarVerified && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                                eKYC ✓
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">{u.roleTitle}</p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            District: {u.district}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 rounded-b-xl flex items-center justify-between">
                    <span>DigiLocker / Aadhaar Verified</span>
                    <span className="font-bold text-emerald-600 font-mono">RBAC Active</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
