import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, getPortalPath } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import {
  ShieldCheck,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Globe,
  Bell,
  FileCheck,
  MessageSquare
} from "lucide-react";
import { t } from "../../i18n/translations";

export const GovtHeader: React.FC = () => {
  const { currentUser, isAuthenticated, logout, loginAsRole, demoUsers } = useAuth();
  const { currentLanguage, setCurrentLanguage, notifications, markNotificationAsRead, setWhatsappSimulatorOpen } = useApp();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [fontSize, setFontSize] = useState<"normal" | "large" | "larger">("normal");

  const navigate = useNavigate();

  const handleRoleSwitch = (roleKey: any) => {
    loginAsRole(roleKey);
    setRoleDropdownOpen(false);
    navigate(getPortalPath(roleKey));
  };

  const unreadNotifs = notifications.filter((n) => n.status !== "read");

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* 1. Top Government of India & Jharkhand Strip */}
      <div className="bg-[#0b1d33] text-slate-200 text-[11px] px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between border-b border-[#163b5f]">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-100 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            <span>झारखंड सरकार | Government of Jharkhand</span>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 hidden md:inline">
            उच्च एवं तकनीकी शिक्षा विभाग (Dept. of Higher & Technical Education)
          </span>
        </div>

        {/* Accessibility & Language */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1 text-slate-300 text-[10px]">
            <span>Font Size:</span>
            <button
              onClick={() => setFontSize("normal")}
              className={`px-1 rounded hover:bg-slate-800 ${fontSize === "normal" ? "font-bold text-white bg-slate-800" : ""}`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize("large")}
              className={`px-1 rounded hover:bg-slate-800 ${fontSize === "large" ? "font-bold text-white bg-slate-800" : ""}`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize("larger")}
              className={`px-1 rounded hover:bg-slate-800 ${fontSize === "larger" ? "font-bold text-white bg-slate-800" : ""}`}
            >
              A+
            </button>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-1 px-1.5 py-0.5 rounded text-slate-200 hover:bg-slate-800 text-[10px]"
            >
              <Globe className="w-3 h-3 text-emerald-400" />
              <span className="uppercase font-medium">{currentLanguage}</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white text-slate-800 rounded shadow-lg border border-slate-200 py-1 z-50 text-[11px]">
                <button
                  onClick={() => { setCurrentLanguage("en"); setLangDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1 hover:bg-slate-100"
                >
                  English
                </button>
                <button
                  onClick={() => { setCurrentLanguage("hi"); setLangDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1 hover:bg-slate-100"
                >
                  हिन्दी (Hindi)
                </button>
                <button
                  onClick={() => { setCurrentLanguage("nagpuri"); setLangDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1 hover:bg-slate-100"
                >
                  नागपुरी (Nagpuri)
                </button>
                <button
                  onClick={() => { setCurrentLanguage("santali"); setLangDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1 hover:bg-slate-100"
                >
                  संताली (Santali)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Official Portal Identity Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Seal */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            <div className="w-11 h-11 rounded bg-[#0f2942] text-white flex flex-col items-center justify-center font-serif font-bold text-xs tracking-wider border border-[#1e3a5f] shrink-0">
              <span className="text-[9px] uppercase font-sans text-amber-400 font-semibold tracking-tighter">GOVT OF</span>
              <span className="text-sm leading-none font-bold text-white">JH</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-extrabold text-base sm:text-lg text-[#0f2942] tracking-tight">
                  JSICP
                </span>
                <span className="bg-[#f1f5f9] text-[#0f2942] text-[10px] font-bold px-2 py-0.5 rounded border border-slate-300">
                  झारखंड पोर्टल
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-tight">
                झारखंड सामाजिक नवाचार सहयोग पोर्टल
              </p>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                Jharkhand Societal Innovation Collaboration Portal • SIH 2026
              </p>
            </div>
          </Link>

          {/* Right Action Area */}
          <div className="flex items-center space-x-3">
            {/* WhatsApp Reporting Gateway Trigger */}
            <button
              onClick={() => setWhatsappSimulatorOpen(true)}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-md text-xs font-bold shadow-xs transition hover:scale-105"
              title="Report problem via WhatsApp simulator"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">{t("report_via_whatsapp", currentLanguage)}</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>

            {isAuthenticated && currentUser ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    className="p-2 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition relative"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadNotifs.length > 0 && (
                      <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {unreadNotifs.length}
                      </span>
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow-xl border border-slate-200 py-2 z-50 text-xs">
                      <div className="px-3 py-2 border-b border-slate-100 font-bold text-slate-800 flex justify-between">
                        <span>Official Alerts</span>
                        <span className="text-slate-500 font-normal">{notifications.length} total</span>
                      </div>
                      <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                        {notifications.slice(0, 4).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationAsRead(n.id)}
                            className={`p-2.5 hover:bg-slate-50 cursor-pointer ${n.status !== "read" ? "bg-amber-50/50" : ""}`}
                          >
                            <div className="flex justify-between text-[11px] font-semibold text-slate-900">
                              <span>{n.title}</span>
                              <span className="uppercase text-[9px] text-slate-500 font-mono">{n.channel}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Role Switcher & User Profile */}
                <div className="relative">
                  <button
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    className="flex items-center space-x-2 bg-[#f8fafc] hover:bg-slate-100 border border-slate-300 px-2.5 py-1.5 rounded transition"
                  >
                    <div className="w-6 h-6 rounded bg-[#0f2942] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {currentUser.fullName[0]}
                    </div>
                    <div className="text-left hidden md:block">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-bold text-slate-900 max-w-[120px] truncate">
                          {currentUser.fullName}
                        </span>
                        {currentUser.aadhaarVerified && (
                          <span title="DigiLocker / Aadhaar eKYC Verified">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">
                        {currentUser.roleTitle}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {roleDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow-xl border border-slate-200 py-2 z-50 text-xs">
                      <div className="px-3.5 py-2 border-b border-slate-100 bg-slate-50 text-slate-700">
                        <span className="font-bold text-[11px] text-slate-800 uppercase tracking-wider block">
                          Switch Dedicated Stakeholder Portal:
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Test the system from each actor isolated workspace:
                        </p>
                      </div>

                      <div className="py-1 max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {[
            {
              category: "🏛️ BIT Mesra Ecosystem (Water, Environment & IoT)",
              keys: ["hei_nodal", "faculty", "student", "student_priya", "student_sneha", "student_amit"]
            },
            {
              category: "⛏️ IIT (ISM) Dhanbad Ecosystem (Mining Tech & Robotics)",
              keys: ["hei_iit_dhanbad", "faculty_iit", "student_iit_rohan", "student_iit_ananya", "student_iit_vikas"]
            },
            {
              category: "🏥 AIIMS Deoghar Ecosystem (MedTech & Cold-Chain)",
              keys: ["hei_aiims_deoghar", "faculty_aiims", "student_aiims_deepak", "student_aiims_kavita"]
            },
            {
              category: "🌾 Birsa Agricultural University - BAU (AgriTech & Bio-Processing)",
              keys: ["hei_bau_ranchi", "faculty_bau", "student_bau_birsa", "student_bau_pooja"]
            },
            {
              category: "🏭 Industry & CSR Co-Funding Anchors",
              keys: ["industry"]
            },
            {
              category: "🏛️ State Apex Command & District Administration",
              keys: ["govt_admin"]
            },
            {
              category: "👥 Grassroots Citizens & Panchayati Raj (PRI)",
              keys: ["citizen", "pri"]
            }
          ].map((grp) => (
                          <div key={grp.category} className="py-1">
                            <span className="px-3.5 py-0.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider block bg-slate-50/70">
                              {grp.category}
                            </span>
                            {grp.keys.map((roleKey) => {
                              const u = demoUsers[roleKey];
                              if (!u) return null;
                              const isActive = currentUser.id === u.id;
                              return (
                                <button
                                  key={roleKey}
                                  onClick={() => handleRoleSwitch(roleKey as any)}
                                  className={`w-full text-left px-3.5 py-1.5 hover:bg-blue-50/60 transition flex items-center space-x-2 ${
                                    isActive ? "bg-blue-50 font-bold border-l-2 border-[#0f2942]" : ""
                                  }`}
                                >
                                  <div className="w-5 h-5 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-[9px] font-bold shrink-0">
                                    {u.fullName[0]}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-semibold text-slate-900 truncate">
                                        {u.fullName}
                                      </span>
                                      <span className="text-[8px] bg-slate-100 text-slate-500 font-mono px-1 rounded uppercase">
                                        {roleKey.replace("student_", "").replace("hei_", "")}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 truncate">{u.roleTitle}</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>

                      <div className="px-3 py-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <button
                          onClick={() => {
                            logout();
                            navigate("/login");
                            setRoleDropdownOpen(false);
                          }}
                          className="flex items-center space-x-1 text-rose-700 hover:text-rose-900 font-semibold"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                        <span className="text-[10px] text-slate-400 font-mono">DigiLocker SSO</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/track"
                  className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Track Complaint</span>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#0f2942] hover:bg-[#163b5f] text-white rounded text-xs font-semibold shadow-xs"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In / Parichay SSO</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
