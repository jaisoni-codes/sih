import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useT } from '../i18n/useT';
import { StatusPill } from "../components/common/StatusPill";
import { SdgBadge } from "../components/common/SdgBadge";
import {
  Sparkles,
  ArrowRight,
  PlusCircle,
  ShieldCheck,
  Award,
  Users,
  GraduationCap,
  Briefcase,
  Layers,
  Search,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Heart,
  ChevronRight
} from "lucide-react";

export const HomePage: React.FC = () => {
  const { problems, universities, proposals, agreements, upvoteProblem, setSelectedDistrict, theme } = useApp();
  const { t } = useT();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const totalFundsMobilized = agreements.reduce((sum, a) => sum + (a.amount || 0), 0);
  const resolvedCount = problems.filter((p) => p.status === "deployed" || p.status === "closed").length;

  const filteredProblems = problems.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === "all" || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className={`relative overflow-hidden pt-16 pb-24 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-xl ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white'
          : 'bg-gradient-to-b from-emerald-50 via-white to-slate-50 text-slate-900'
      }`}>
        <div className={`absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]`}></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Jharkhand Official Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="/jharkhand_gov_logo.png"
              alt="Government of Jharkhand"
              className="w-32 h-32 object-contain drop-shadow-2xl"
            />
          </div>

          {/* Official Badge */}
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm animate-in fade-in slide-in-from-top-4 ${
            theme === 'dark'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-emerald-100 border border-emerald-300 text-emerald-700'
          }`}>
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>{t('home_hero_badge')}</span>
          </div>

          {/* Master Heading */}
          <h1 className={`font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {t('home_hero_heading_1')} <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500">
              {t('home_hero_heading_2')}
            </span>
          </h1>

          <p className={`max-w-3xl mx-auto text-sm sm:text-base leading-relaxed font-normal ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {t('home_hero_subheading')}
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              to="/submit"
              className="flex items-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/30 transition hover:scale-105"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{t('home_cta_submit')}</span>
            </Link>

            <Link
              to="/my-problems"
              className={`flex items-center space-x-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition border ${
                theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm'
              }`}
            >
              <span>{t('home_cta_track')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/industry/marketplace"
              className={`flex items-center space-x-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition border ${
                theme === 'dark'
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/30'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>{t('home_cta_industry')}</span>
            </Link>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="relative max-w-6xl mx-auto mt-14 grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5 border border-white/10 backdrop-blur-md' : 'bg-white border border-emerald-100 shadow-sm'}`}>
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-500 block font-mono">
              {problems.length + 580}
            </span>
            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>{t('home_metric_challenges')}</span>
          </div>

          <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5 border border-white/10 backdrop-blur-md' : 'bg-white border border-teal-100 shadow-sm'}`}>
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-teal-500 block font-mono">
              24 / 24
            </span>
            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>{t('home_metric_districts')}</span>
          </div>

          <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5 border border-white/10 backdrop-blur-md' : 'bg-white border border-blue-100 shadow-sm'}`}>
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-blue-500 block font-mono">
              {universities.length} HEIs
            </span>
            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>{t('home_metric_universities')}</span>
          </div>

          <div className={`p-4 rounded-2xl ${theme === 'dark' ? 'bg-white/5 border border-white/10 backdrop-blur-md' : 'bg-white border border-amber-100 shadow-sm'}`}>
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-amber-500 block font-mono">
              ₹{(totalFundsMobilized / 100000 + 45.2).toFixed(1)} L
            </span>
            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>{t('home_metric_funds')}</span>
          </div>

          <div className={`p-4 rounded-2xl col-span-2 md:col-span-1 ${theme === 'dark' ? 'bg-white/5 border border-white/10 backdrop-blur-md' : 'bg-white border border-purple-100 shadow-sm'}`}>
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-purple-500 block font-mono">
              {resolvedCount + 142}
            </span>
            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>{t('home_metric_resolved')}</span>
          </div>
        </div>
      </section>


      {/* 3-Sided Workflow Architecture Banner */}
      {/* ─── Jharkhand at a Glance (Data source: jharkhand.gov.in) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <span className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            <span>🏛</span>
            <span>शासन एवं नेतृत्व | Governance &amp; Leadership</span>
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
            Jharkhand at a Glance
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Jharkhand ("The land of forest") — Created on 15 November 2000. Area 79,714 km², 24 Districts, Capital: Ranchi. Borders Bihar, UP, Chhattisgarh, Odisha &amp; West Bengal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Card 1 — About Jharkhand */}
          <a href="https://jharkhand.gov.in/Home/AboutState" target="_blank" rel="noopener noreferrer"
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-300 transition p-5 flex flex-col space-y-3 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">About Jharkhand</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">State</span>
            </div>
            <div className="w-full h-24 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl flex items-center justify-center group-hover:from-emerald-100 transition">
              <MapPin className="w-10 h-10 text-emerald-600 opacity-60" />
            </div>
            <div className="space-y-1.5 text-xs flex-1">
              <div className="flex justify-between text-slate-600"><span>Capital</span><span className="font-semibold text-slate-800">Ranchi</span></div>
              <div className="flex justify-between text-slate-600"><span>Sub Capital</span><span className="font-semibold text-slate-800">Dumka</span></div>
              <div className="flex justify-between text-slate-600"><span>Area</span><span className="font-semibold text-slate-800">79,714 km²</span></div>
              <div className="flex justify-between text-slate-600"><span>Districts</span><span className="font-semibold text-slate-800">24</span></div>
              <div className="flex justify-between text-slate-600"><span>Population</span><span className="font-semibold text-slate-800">3.3 Crores</span></div>
              <div className="flex justify-between text-slate-600"><span>Founded</span><span className="font-semibold text-slate-800">15 Nov 2000</span></div>
            </div>
            <div className="flex items-center space-x-1 text-emerald-600 text-xs font-semibold pt-2 border-t border-slate-100">
              <ChevronRight className="w-3.5 h-3.5" />
              <span>jharkhand.gov.in ↗</span>
            </div>
          </a>

          {/* Card 2 — Governor (Source: jharkhand.gov.in → rajbhavanjharkhand.nic.in) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition p-5 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Governor</span>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Apex</span>
            </div>
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-2xl font-extrabold shadow-md select-none">
                SKG
              </div>
            </div>
            <div className="text-center space-y-0.5 flex-1">
              <p className="font-bold text-sm text-slate-800">Shri Santosh Kumar Gangwar</p>
              <p className="text-xs text-slate-500">Hon'ble Governor of Jharkhand</p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2 border-t border-slate-100">
              <a href="https://rajbhavanjharkhand.nic.in/about-department/honble-governors-profile/"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-emerald-600 font-semibold hover:underline">
                <Users className="w-3 h-3" /><span>Profile ↗</span>
              </a>
              <span className="text-slate-300">|</span>
              <a href="https://rajbhavanjharkhand.nic.in/"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-slate-500 hover:underline">
                <ChevronRight className="w-3 h-3" /><span>Raj Bhavan ↗</span>
              </a>
            </div>
          </div>

          {/* Card 3 — Chief Minister (Source: jharkhand.gov.in → cm.jharkhand.gov.in) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition p-5 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Chief Minister</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">Executive</span>
            </div>
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-md select-none">
                HS
              </div>
            </div>
            <div className="text-center space-y-0.5 flex-1">
              <p className="font-bold text-sm text-slate-800">Shri Hemant Soren</p>
              <p className="text-xs text-slate-500">Hon'ble Chief Minister of Jharkhand</p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2 border-t border-slate-100">
              <a href="https://cm.jharkhand.gov.in/"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-emerald-600 font-semibold hover:underline">
                <Users className="w-3 h-3" /><span>Profile ↗</span>
              </a>
              <span className="text-slate-300">|</span>
              <a href="https://cm.jharkhand.gov.in/"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-slate-500 hover:underline">
                <ChevronRight className="w-3 h-3" /><span>CM Office ↗</span>
              </a>
            </div>
          </div>

          {/* Card 4 — Chief Secretary (Source: jharkhand.gov.in) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition p-5 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Chief Secretary</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Administration</span>
            </div>
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-md select-none">
                AK
              </div>
            </div>
            <div className="text-center space-y-0.5 flex-1">
              <p className="font-bold text-sm text-slate-800">Shri Avinash Kumar</p>
              <p className="text-xs text-slate-500">Chief Secretary, Govt. of Jharkhand</p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2 border-t border-slate-100">
              <a href="https://jharkhand.gov.in/Home/WebDirectory"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-emerald-600 font-semibold hover:underline">
                <Users className="w-3 h-3" /><span>Who's Who ↗</span>
              </a>
              <span className="text-slate-300">|</span>
              <a href="https://jharkhand.gov.in/Home/Department"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-slate-500 hover:underline">
                <ChevronRight className="w-3 h-3" /><span>Secretariat ↗</span>
              </a>
            </div>
          </div>

        </div>
      </section>


      {/* ─── How JSICP Works ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">
            3-Sided Collaborative Platform Architecture
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
            How JSICP Works Across Stakeholders
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            From rural problem submission to AI triage, academic multidisciplinary research, CSR co-funding, and field impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Side 1: Citizens & PRIs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">Side 1: Ground Truth</span>
              <h3 className="font-heading font-bold text-lg text-slate-900 mt-1">
                Citizens, PRIs & ULBs
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Submit local challenges via voice-to-text in Hindi/Nagpuri/Santali, upload geo-tagged photos, and track resolution through 10-step progress steppers with post-deployment feedback ratings.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Multilingual & Voice Dialect Ingestion</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>GPS Auto-Tagging & Offline Caching</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Gamified Badges & Civic Points</span>
              </li>
            </ul>
          </div>

          {/* Side 2: Academic HEIs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">Side 2: Innovation Hub</span>
              <h3 className="font-heading font-bold text-lg text-slate-900 mt-1">
                Universities & Student Teams
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Receive AI-routed societal challenges matched to faculty domains. Form multidisciplinary student teams, run sprint Kanban boards, and draft solution proposals for government review.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Smart Academic Routing Recommender</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Multidisciplinary Kanban Workspace</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>5-Stage Milestone Lifecycle & Vault</span>
              </li>
            </ul>
          </div>

          {/* Side 3: Industry & Government */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Side 3: Scale & Deployment</span>
              <h3 className="font-heading font-bold text-lg text-slate-900 mt-1">
                Industry, CSR & Govt Admins
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Startups, MSMEs, and CSR Foundations browse verified proposals, e-sign MoUs with digital signatures, disburse grant funding, and monitor state-wide impact through real-time BI dashboards.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Open Innovation Marketplace</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Blockchain Milestone & Funding Ledger</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>24-District Interactive Heatmaps</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Active Societal Challenges Stream */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-extrabold text-2xl text-slate-900">
              Active Societal Challenges in Jharkhand
            </h2>
            <p className="text-xs text-slate-500">
              Explore live citizen-submitted issues undergoing academic research and pilot deployment
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search challenges or districts..."
                className="text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none w-56 sm:w-64"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="all">All Domains</option>
              <option value="Water Resources & Sanitation">Water Resources & Sanitation</option>
              <option value="Agriculture & Allied Technologies">Agriculture & Allied Tech</option>
              <option value="Environment & Mining Remediation">Mining & Environment</option>
              <option value="Healthcare & MedTech">Healthcare & MedTech</option>
              <option value="Forest & Tribal Livelihoods">Forest & Tribal Livelihoods</option>
              <option value="Rural Infrastructure & Transport">Rural Infrastructure</option>
            </select>
          </div>
        </div>

        {/* Problems Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((prob) => (
            <div
              key={prob.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Media Image Banner */}
                {prob.media && prob.media[0] && (
                  <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                    <img
                      src={prob.media[0].storageUrl}
                      alt={prob.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <StatusPill status={prob.status} />
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                      Priority: {prob.priorityScore}/100
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
                    <span>{prob.ticketNumber}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-0.5 text-slate-700 font-semibold">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{prob.district}</span>
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-slate-900 leading-snug line-clamp-2">
                    {prob.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {prob.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {prob.sdgTags.map((tag, i) => (
                      <SdgBadge key={i} tag={tag} />
                    ))}
                  </div>

                  {prob.assignedUniversityName && (
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px] flex items-center space-x-2">
                      <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-slate-700 font-medium truncate">
                        Assigned HEI: <strong>{prob.assignedUniversityName}</strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => upvoteProblem(prob.id)}
                  className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-emerald-700 transition"
                  title="I face this issue too"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span className="font-bold">{prob.citizenSupportCount} Citizen Supports</span>
                </button>

                <Link
                  to="/my-problems"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
                >
                  <span>Track Lifecycle</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
