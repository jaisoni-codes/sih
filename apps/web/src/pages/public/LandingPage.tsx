import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useAuth, getPortalPath } from "../../context/AuthContext";
import { useT } from "../../i18n/useT";
import { StatusPill } from "../../components/common/StatusPill";
import {
  Search,
  FileCheck,
  PlusCircle,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  Users,
  ExternalLink,
  User,
  Download
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const { problems } = useApp();
  const { loginAsRole } = useAuth();
  const { t } = useT();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");

  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDist = selectedDistrict === "all" || p.district === selectedDistrict;
    return matchesSearch && matchesDist;
  });

  const handleQuickRoleAccess = (role: any) => {
    loginAsRole(role);
    navigate(getPortalPath(role));
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Official Government Hero Header */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-slate-100 text-[#0f2942] px-3 py-1 rounded text-xs font-semibold border border-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>{t("landing_badge")}</span>
              </div>

              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0f2942] tracking-tight leading-tight">
                {t("landing_title")} (JSICP)
              </h1>

              <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
                {t("landing_desc")}
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#163b5f] text-white text-xs font-semibold rounded shadow-xs flex items-center space-x-2 transition"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t("landing_cta_sso")}</span>
                </Link>

                <Link
                  to="/track"
                  className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded flex items-center space-x-2 transition"
                >
                  <FileCheck className="w-4 h-4 text-slate-500" />
                  <span>{t("landing_cta_track")}</span>
                </Link>
              </div>
            </div>

            {/* Quick Stats Panel */}
            <div className="lg:col-span-4 bg-[#f8fafc] p-5 rounded-lg border border-slate-200 space-y-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block border-b border-slate-200 pb-2">
                {t("landing_stat_indicators")}
              </span>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">{t("landing_stat_challenges")}</span>
                  <span className="font-mono font-bold text-lg text-slate-900">{problems.length + 580}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{t("landing_stat_heis")}</span>
                  <span className="font-mono font-bold text-lg text-blue-800">{t("landing_stat_heis_val")}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{t("landing_stat_csr")}</span>
                  <span className="font-mono font-bold text-lg text-emerald-800">{t("landing_stat_csr_val")}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{t("landing_stat_districts")}</span>
                  <span className="font-mono font-bold text-lg text-amber-800">{t("landing_stat_districts_val")}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                {t("landing_stat_verified")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jharkhand at a Glance — Governance & Leadership */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <span className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 px-3 py-1 rounded-full text-xs font-semibold">
                <span>{t("gov_badge")}</span>
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
              {t("gov_heading")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {t("gov_subheading")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: About Jharkhand */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.03] hover:shadow-xl group">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {t("gov_card_about_title")}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {t("gov_card_about_badge")}
                  </span>
                </div>

                <div className="py-2 flex items-center justify-center h-28">
                  <img
                    src="/governance/jharkhand_map.png"
                    alt="Jharkhand District Map"
                    className="max-h-24 max-w-[140px] w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
                  />
                </div>

                <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>{t("gov_capital")}</span>
                    <span className="font-bold text-slate-900">{t("gov_capital_val")}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{t("gov_area")}</span>
                    <span className="font-bold text-slate-900">{t("gov_area_val")}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{t("gov_districts")}</span>
                    <span className="font-bold text-slate-900">{t("gov_districts_val")}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{t("gov_population")}</span>
                    <span className="font-bold text-slate-900">{t("gov_population_val")}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-2">
                <a
                  href="https://jharkhand.gov.in/Home/AboutState"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center space-x-1.5 transition shadow-2xs"
                >
                  <span>{t("gov_official_portal")}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Card 2: Governor */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.03] hover:shadow-xl group">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {t("gov_card_gov_title")}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    {t("gov_card_gov_badge")}
                  </span>
                </div>

                <div className="py-2 flex justify-center items-center h-28">
                  <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400/30 to-slate-200 shadow-md ring-2 ring-amber-500/30 group-hover:ring-amber-500/70 transition-all flex items-center justify-center">
                    <img
                      src="/governance/governor_santosh_gangwar.png"
                      alt="Shri Santosh Kumar Gangwar"
                      className="w-full h-full rounded-full object-cover object-center shadow-inner"
                    />
                  </div>
                </div>

                <div className="text-center space-y-1 mt-1">
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {t("gov_governor_name")}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {t("gov_governor_role")}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-2 flex items-center space-x-2">
                <a
                  href="https://rajbhavanjharkhand.nic.in/about-department/honble-governors-profile/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-[11px] font-semibold text-slate-700 flex items-center justify-center space-x-1 transition shadow-2xs"
                >
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t("gov_profile_btn")}</span>
                </a>
                <a
                  href="/governance/governor_santosh_gangwar.png"
                  download="Governor_Santosh_Kumar_Gangwar.png"
                  className="flex-1 py-2 px-2 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 flex items-center justify-center space-x-1 transition shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t("gov_photo_btn")}</span>
                </a>
              </div>
            </div>

            {/* Card 3: Chief Minister */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.03] hover:shadow-xl group">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {t("gov_card_cm_title")}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {t("gov_card_cm_badge")}
                  </span>
                </div>

                <div className="py-2 flex justify-center items-center h-28">
                  <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-emerald-500/30 to-slate-200 shadow-md ring-2 ring-emerald-500/30 group-hover:ring-emerald-500/70 transition-all flex items-center justify-center">
                    <img
                      src="/governance/cm_hemant_soren.png"
                      alt="Shri Hemant Soren"
                      className="w-full h-full rounded-full object-cover object-center shadow-inner"
                    />
                  </div>
                </div>

                <div className="text-center space-y-1 mt-1">
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {t("gov_cm_name")}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {t("gov_cm_role")}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-2 flex items-center space-x-2">
                <a
                  href="https://cm.jharkhand.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-2 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 text-[11px] font-semibold text-slate-700 flex items-center justify-center space-x-1 transition shadow-2xs"
                >
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t("gov_profile_btn")}</span>
                </a>
                <a
                  href="https://jharkhand.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-2 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 flex items-center justify-center space-x-1 transition shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t("gov_official_portal")}</span>
                </a>
              </div>
            </div>

            {/* Card 4: Chief Secretary */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.03] hover:shadow-xl group">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {t("gov_card_cs_title")}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {t("gov_card_cs_badge")}
                  </span>
                </div>

                <div className="py-2 flex justify-center items-center h-28">
                  <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-blue-500/30 to-slate-200 shadow-md ring-2 ring-blue-500/30 group-hover:ring-blue-500/70 transition-all flex items-center justify-center">
                    <img
                      src="/governance/cs_avinash_kumar.png"
                      alt="Shri Avinash Kumar"
                      className="w-full h-full rounded-full object-cover object-center shadow-inner"
                    />
                  </div>
                </div>

                <div className="text-center space-y-1 mt-1">
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {t("gov_cs_name")}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {t("gov_cs_role")}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-2 flex items-center space-x-2">
                <a
                  href="https://jharkhand.gov.in/Home/WebDirectory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-[11px] font-semibold text-slate-700 flex items-center justify-center space-x-1 transition shadow-2xs"
                >
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t("gov_profile_btn")}</span>
                </a>
                <a
                  href="https://jharkhand.gov.in/Home/WebDirectory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-2 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-[11px] font-semibold text-slate-700 flex items-center justify-center space-x-1 transition shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t("gov_secretariat_btn")}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Stakeholder Portals Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h3 className="font-heading font-bold text-base text-slate-900">
            {t("landing_ws_heading")}
          </h3>
          <p className="text-xs text-slate-500">
            {t("landing_ws_subheading")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Citizen */}
          <div
            onClick={() => handleQuickRoleAccess("citizen")}
            className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 shadow-xs cursor-pointer transition space-y-2"
          >
            <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-sm text-slate-900">
              {t("landing_ws_citizen_title")}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t("landing_ws_citizen_desc")}
            </p>
            <span className="text-xs font-semibold text-emerald-800 flex items-center space-x-1 pt-1">
              <span>{t("landing_open_portal")}</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* University */}
          <div
            onClick={() => handleQuickRoleAccess("hei_nodal")}
            className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 shadow-xs cursor-pointer transition space-y-2"
          >
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-800 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-sm text-slate-900">
              {t("landing_ws_hei_title")}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t("landing_ws_hei_desc")}
            </p>
            <span className="text-xs font-semibold text-blue-800 flex items-center space-x-1 pt-1">
              <span>{t("landing_open_portal")}</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Industry */}
          <div
            onClick={() => handleQuickRoleAccess("industry")}
            className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 shadow-xs cursor-pointer transition space-y-2"
          >
            <div className="w-8 h-8 rounded bg-amber-50 text-amber-800 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-sm text-slate-900">
              {t("landing_ws_industry_title")}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t("landing_ws_industry_desc")}
            </p>
            <span className="text-xs font-semibold text-amber-800 flex items-center space-x-1 pt-1">
              <span>{t("landing_open_portal")}</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Govt Admin */}
          <div
            onClick={() => handleQuickRoleAccess("govt_admin")}
            className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 shadow-xs cursor-pointer transition space-y-2"
          >
            <div className="w-8 h-8 rounded bg-purple-50 text-purple-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-sm text-slate-900">
              {t("landing_ws_admin_title")}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t("landing_ws_admin_desc")}
            </p>
            <span className="text-xs font-semibold text-purple-800 flex items-center space-x-1 pt-1">
              <span>{t("landing_open_portal")}</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </section>

      {/* Searchable Public Directory of Challenges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              {t("landing_dir_heading")}
            </h3>
            <p className="text-xs text-slate-500">
              {t("landing_dir_subheading")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <input
              type="text"
              placeholder={t("landing_dir_search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border border-slate-300 rounded focus:outline-none focus:border-[#0f2942]"
            />

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="p-2 border border-slate-300 rounded bg-slate-50"
            >
              <option value="all">{t("landing_dir_all_districts")}</option>
              <option value="Ranchi">Ranchi</option>
              <option value="Dhanbad">Dhanbad</option>
              <option value="East Singhbhum">East Singhbhum</option>
              <option value="Khunti">Khunti</option>
              <option value="Bokaro">Bokaro</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredProblems.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{p.ticketNumber}</span>
                  <StatusPill status={p.status} />
                  <span className="text-slate-500">{t("landing_dir_district")} {p.district} ({p.block || "Sadar"})</span>
                </div>
                <span className="font-mono text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>

              <div>
                <h4 className="font-heading font-bold text-sm text-slate-900">{p.title}</h4>
                <p className="text-slate-600 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <div className="flex items-center space-x-2">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">{p.category}</span>
                  {p.assignedUniversityName && (
                    <span className="text-slate-600">{t("landing_dir_assigned_hei")} <strong>{p.assignedUniversityName}</strong></span>
                  )}
                </div>

                <Link
                  to="/track"
                  className="text-blue-700 hover:text-blue-900 font-semibold"
                >
                  {t("landing_dir_view_roadmap")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
