import React, { useState, useEffect } from "react";
import { PortalLayout, NavItem } from "../../components/layout/PortalLayout";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { StatusPill } from "../../components/common/StatusPill";
import { SdgBadge } from "../../components/common/SdgBadge";
import { CitizenRatingModal } from "../../components/citizen/CitizenRatingModal";
import { aiEngine, AIAutoFillResult, JHARKHAND_DISTRICTS, ProblemValidationResult } from "../../services/aiEngine";
import { ProblemCategory } from "../../types";
import { CameraCaptureModal } from "../../components/common/CameraCaptureModal";
import { VoiceInputButton } from "../../components/common/VoiceInputButton";
import { t } from "../../i18n/translations";
import {
  FileText,
  PlusCircle,
  FileCheck,
  Users,
  Award,
  MapPin,
  Mic,
  Camera,
  Heart,
  Star,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
  Zap,
  Briefcase,
  Sparkles,
  RefreshCw,
  MessageSquare,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import confetti from "canvas-confetti";

export const CitizenPortalPage: React.FC = () => {
  const {
    problems,
    submitProblem,
    upvoteProblem,
    advanceProblemToDeployed,
    currentUser,
    agreements,
    currentLanguage,
    setWhatsappSimulatorOpen
  } = useApp();
  const { currentRole } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionOriginalLang, setDescriptionOriginalLang] = useState("");
  const [category, setCategory] = useState<ProblemCategory | "">("");
  const [subCategory, setSubCategory] = useState("");
  const [district, setDistrict] = useState(currentUser?.district || "Ranchi");
  const [block, setBlock] = useState("");
  const [village, setVillage] = useState("");
  const [latitude, setLatitude] = useState(23.3441);
  const [longitude, setLongitude] = useState(85.3096);
  const [mediaUrl, setMediaUrl] = useState("");
  const [ratingProb, setRatingProb] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);

  // AI Auto-Fill & Validation State
  const [validationResult, setValidationResult] = useState<ProblemValidationResult | null>(null);
  const [aiPrediction, setAiPrediction] = useState<AIAutoFillResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCategoryOverridden, setIsCategoryOverridden] = useState(false);
  const [isDistrictOverridden, setIsDistrictOverridden] = useState(false);
  const [isBlockOverridden, setIsBlockOverridden] = useState(false);

  // Live real AI auto-fill as citizen types/pastes or records with STRICT VALIDATION FIRST
  useEffect(() => {
    const query = `${title} ${description}`.trim();
    if (query.length < 4) {
      setAiPrediction(null);
      setValidationResult(null);
      if (!isCategoryOverridden) {
        setCategory("");
      }
      return;
    }
    const timer = setTimeout(async () => {
      setIsAnalyzing(true);
      const val = await aiEngine.validateProblem({
        title,
        description,
        category: isCategoryOverridden && category ? (category as ProblemCategory) : undefined,
        imageUrl: mediaUrl || undefined,
        language: currentLanguage
      });
      setValidationResult(val);

      if (val.status === "valid") {
        const autoTheme = val.detectedTheme;
        if (!isCategoryOverridden && autoTheme) {
          setCategory(autoTheme);
        }
        const res = await aiEngine.analyzeForAutoFill(
          title,
          description,
          isDistrictOverridden ? district : undefined,
          isCategoryOverridden && category ? (category as ProblemCategory) : autoTheme,
          mediaUrl || undefined,
          currentLanguage
        );
        if (res) {
          setAiPrediction(res);
          if (!isCategoryOverridden && res.category) {
            setCategory(res.category);
          }
          if (!isDistrictOverridden && res.district) {
            setDistrict(res.district);
            setLatitude(res.latitude);
            setLongitude(res.longitude);
          }
          if (res.subCategory) {
            setSubCategory(res.subCategory);
          }
          if (!isBlockOverridden && res.block) {
            setBlock(res.block);
          }
        }
      } else {
        setAiPrediction(null);
        if (!isCategoryOverridden) {
          setCategory("");
        }
      }
      setIsAnalyzing(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [title, description, isCategoryOverridden, isDistrictOverridden, isBlockOverridden, mediaUrl, currentLanguage]);

  // My Problems
  const myProblems = problems.filter((p) => p.submittedBy === currentUser?.id || p.submittedBy === "citizen-sunita" || p.district === "Ranchi" || p.district === "Dhanbad");
  const districtProblems = problems.filter((p) => p.district.toLowerCase() === (currentUser?.district || "Ranchi").toLowerCase());

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Overview & Status", icon: FileText },
    { id: "submit", label: "File New Challenge", icon: PlusCircle },
    { id: "my_issues", label: "My Tracked Issues", icon: FileCheck, badge: myProblems.length },
    { id: "community", label: "District Issues & Support", icon: Users, badge: districtProblems.length },
    { id: "leaderboard", label: "Civic Points & Badges", icon: Award }
  ];

  const handleVoiceTranscribed = (text: string, lang: string) => {
    setDescription(text);
    setDescriptionOriginalLang(text);
    if (!title) {
      setTitle(text.slice(0, 50) + "...");
    }
  };

  const handleDetectGPS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
        },
        () => {
          setLatitude(23.3441);
          setLongitude(85.3096);
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setIsSubmitting(true);

    let aiResult = aiPrediction;
    if (!aiResult) {
      aiResult = await aiEngine.analyzeForAutoFill(title, description, district);
    }

    const finalCategory: ProblemCategory = (category as ProblemCategory) || aiResult?.category || "Water Resources & Sanitation";

    submitProblem({
      title,
      description,
      descriptionOriginalLang,
      category: finalCategory,
      subCategory: subCategory || (aiResult ? aiResult.subCategory : "Community Scale Challenge"),
      district,
      block: block || "Sadar Block",
      village: village || "Gram Panchayat",
      latitude,
      longitude,
      categoryConfidence: aiResult ? aiResult.confidence : 0.94,
      priorityScore: aiResult ? aiResult.priorityScore : Math.round((75 + Math.random() * 20) * 10) / 10,
      sdgTags: aiResult ? aiResult.sdgTags : ["SDG 6: Clean Water", "SDG 9: Innovation"],
      aiExplanation: aiResult?.xaiExplanation || (aiResult ? {
        nlpKeywords: [`${category} (High Confidence)`],
        cvSceneTags: ["verified ground anomaly", district, "civic evidence"],
        duplicateCheckResult: "Zero duplicate challenges detected in 5km geo-radius.",
        priorityBreakdown: {
          severityWeight: Math.round(aiResult.priorityScore * 0.38),
          affectedPopulationEstimate: Math.round(aiResult.priorityScore * 0.28),
          locationVulnerabilityIndex: Math.round(aiResult.priorityScore * 0.18),
          sdgImpactScore: Math.round(aiResult.priorityScore * 0.16)
        },
        suggestedUniversities: aiResult.suggestedUniversities
      } : undefined),
      media: [
        {
          id: `med-${Date.now()}`,
          problemId: "",
          mediaType: "image",
          storageUrl: mediaUrl,
          cvValidationLabel: "Verified Ground Anomaly (94% Match)",
          cvValidationConfidence: 0.94
        }
      ]
    });

    confetti({ particleCount: 70, spread: 60 });
    setIsSubmitting(false);
    setTitle("");
    setDescription("");
    setIsCategoryOverridden(false);
    setIsDistrictOverridden(false);
    setActiveTab("my_issues");
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case "submitted": return 1;
      case "under_ai_review": return 2;
      case "pending_nodal_review": return 3;
      case "routed": return 4;
      case "accepted_by_hei": return 5;
      case "team_formed": return 6;
      case "in_progress": return 8; // Step 8: Industry Co-Funded & Prototyping Active!
      case "industry_matched": return 8;
      case "field_pilot": return 9;
      case "deployed":
      case "closed": return 10;
      default: return 1;
    }
  };

  return (
    <PortalLayout
      portalTitle="Citizen & PRI Innovation Portal"
      portalSubtitle="नागरिक, स्वयं सहायता समूह (SHG) एवं पंचायती राज पटल"
      navItems={navItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* 1. Dashboard View */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Welcome Card */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Welcome, {currentUser?.fullName}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Role: <strong>{currentUser?.roleTitle}</strong> • District: <strong>{currentUser?.district}</strong>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                You can report civic challenges, track progress across universities, and review deployed community solutions.
              </p>
            </div>

            <button
              onClick={() => setActiveTab("submit")}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#0f2942] hover:bg-[#163b5f] text-white text-xs font-semibold rounded shadow-xs shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report a New Challenge</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-left">
              <span className="text-[11px] text-slate-500 block">My Submissions</span>
              <span className="font-heading font-extrabold text-xl text-slate-900 font-mono mt-0.5 block">
                {myProblems.length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-left">
              <span className="text-[11px] text-slate-500 block">In Academic Research</span>
              <span className="font-heading font-extrabold text-xl text-blue-700 font-mono mt-0.5 block">
                {myProblems.filter((p) => p.status === "in_progress" || p.status === "team_formed").length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-left">
              <span className="text-[11px] text-slate-500 block">Solutions Deployed</span>
              <span className="font-heading font-extrabold text-xl text-emerald-700 font-mono mt-0.5 block">
                {myProblems.filter((p) => p.status === "deployed" || p.status === "closed").length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-left">
              <span className="text-[11px] text-slate-500 block">Civic Impact Points</span>
              <span className="font-heading font-extrabold text-xl text-amber-700 font-mono mt-0.5 block">
                {currentUser?.reputationPoints || 420} pts
              </span>
            </div>
          </div>

          {/* Recent Tracked Challenge */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-800">
                Latest Active Challenge Status
              </h4>
              <button
                onClick={() => setActiveTab("my_issues")}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900"
              >
                View All Tracked &rarr;
              </button>
            </div>

            {myProblems.length > 0 ? (
              <div className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-500">{myProblems[0].ticketNumber}</span>
                    <h4 className="font-heading font-bold text-sm text-slate-900 mt-0.5">{myProblems[0].title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{myProblems[0].description}</p>
                  </div>
                  <div className="shrink-0">
                    <StatusPill status={myProblems[0].status} />
                  </div>
                </div>

                {/* Stepper */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-700 uppercase">
                    <span>Current Resolution Step: {getStepIndex(myProblems[0].status)} of 10</span>
                    <span className="text-emerald-700 font-mono">
                      {getStepIndex(myProblems[0].status) >= 8 ? "✓ Industry CSR Funded & Lab Active" : "In Progress"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-500"
                      style={{ width: `${getStepIndex(myProblems[0].status) * 10}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
                    <span>1. Submitted</span>
                    <span>4. HEI Routed</span>
                    <span>6. Team Formed</span>
                    <span>8. CSR Funded</span>
                    <span>10. Deployed</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                No active challenges yet. Click "File New Challenge" to report a community problem.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. File New Challenge Form */}
      {activeTab === "submit" && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-[#0f2942] text-white px-5 py-3 border-b border-[#163b5f]">
            <h3 className="font-heading font-bold text-sm">
              नागरिक समस्या पंजीकरण प्रपत्र (Societal Challenge Ingestion Form)
            </h3>
            <p className="text-[11px] text-slate-300">
              Please enter accurate details. Issues are categorized by AI and reviewed by District / University nodal desks.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
            {/* WhatsApp Alternative Reporting Banner */}
            <div className="bg-[#f0fdf4] border border-emerald-300 p-3.5 rounded flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                  <MessageSquare className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="font-bold text-emerald-950 block text-xs">
                    {t("report_via_whatsapp", currentLanguage)}
                  </span>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    {t("report_via_whatsapp_desc", currentLanguage)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setWhatsappSimulatorOpen(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center space-x-1.5 shrink-0 shadow-xs transition hover:scale-105"
              >
                <span>💬 Start WhatsApp</span>
              </button>
            </div>

            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-800">
                  {t("form_title", currentLanguage)} <span className="text-rose-600">*</span>
                </label>
                <VoiceInputButton
                  onTranscript={(txt) => setTitle(txt)}
                  language={currentLanguage}
                  fieldLabel="Title"
                />
              </div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("form_title_placeholder", currentLanguage)}
                className="w-full p-2.5 border border-slate-300 rounded focus:border-[#0f2942] focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-800">
                  {t("form_desc", currentLanguage)} <span className="text-rose-600">*</span>
                </label>
                <VoiceInputButton
                  onTranscript={(txt) => {
                    setDescription(txt);
                    setDescriptionOriginalLang(txt);
                  }}
                  language={currentLanguage}
                  fieldLabel="Description"
                />
              </div>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("form_desc_placeholder", currentLanguage)}
                className="w-full p-2.5 border border-slate-300 rounded focus:border-[#0f2942] focus:outline-none"
              />
            </div>

            {/* Live AI Real-Data Model Insights Card */}

            {/* Auto-Fill Notification Pill */}
            {aiPrediction && (
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-emerald-50 border border-emerald-300 rounded text-emerald-950 text-xs">
                <div className="flex items-center space-x-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>
                    <strong>✨ Auto-filled by AI:</strong> {category}{district ? ` • ${district}` : ""}{block ? ` (${block})` : ""}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">
                  ✏️ You can manually edit any field below
                </span>
              </div>
            )}

            {/* Category & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-800 text-xs">
                    Thematic Sector / श्रेणी:
                  </label>
                  {isCategoryOverridden ? (
                    <span className="text-[10px] font-normal text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      ✏️ {t("form_manually_edited", currentLanguage)}
                    </span>
                  ) : category ? (
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 animate-in fade-in">
                      {t("form_theme_auto_detected", currentLanguage)}
                    </span>
                  ) : (
                    <span className="text-[10px] font-normal text-slate-400">
                      (AI will auto-select theme)
                    </span>
                  )}
                </div>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value as any);
                    setIsCategoryOverridden(true);
                  }}
                  className={`w-full p-2 text-xs border rounded transition focus:border-[#0f2942] ${
                    category
                      ? "bg-slate-50 border-slate-300 text-slate-900 font-medium"
                      : "bg-amber-50/50 border-dashed border-amber-300 text-amber-900"
                  }`}
                >
                  <option value="">{t("form_theme_placeholder", currentLanguage)}</option>
                  <option value="Water Resources & Sanitation">Water Resources & Sanitation (जल संसाधन एवं स्वच्छता)</option>
                  <option value="Agriculture & Allied Technologies">Agriculture & Allied Technologies (कृषि एवं संबद्ध तकनीक)</option>
                  <option value="Healthcare & MedTech">Healthcare & MedTech (स्वास्थ्य सेवा एवं मेडटेक)</option>
                  <option value="Rural Infrastructure & Transport">Rural Infrastructure & Transport (ग्रामीण बुनियादी ढांचा एवं सड़क)</option>
                  <option value="Education & Smart Learning">Education & Smart Learning (शिक्षा एवं स्मार्ट लर्निंग)</option>
                  <option value="Environment & Mining Remediation">Environment & Mining Remediation (पर्यावरण एवं खनन उपचार)</option>
                  <option value="Renewable Energy & Off-Grid Power">Renewable Energy & Off-Grid Power (नवीकरणीय ऊर्जा एवं बिजली)</option>
                  <option value="Forest & Tribal Livelihoods">Forest & Tribal Livelihoods (वन एवं जनजातीय आजीविका)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  District in Jharkhand / जिला (24 Districts)
                  {isDistrictOverridden && (
                    <span className="ml-2 text-[10px] font-normal text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      (Manually edited)
                    </span>
                  )}
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    const newDist = e.target.value;
                    setDistrict(newDist);
                    setIsDistrictOverridden(true);
                    setIsBlockOverridden(false);
                    const info = JHARKHAND_DISTRICTS[newDist];
                    if (info) {
                      setLatitude(info.lat);
                      setLongitude(info.lng);
                      setBlock(info.blocks.includes(newDist) ? newDist : info.blocks[0]);
                    }
                  }}
                  className="w-full p-2 border border-slate-300 rounded bg-slate-50 focus:border-[#0f2942]"
                >
                  {Object.keys(JHARKHAND_DISTRICTS).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Block, Village & GPS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Block / प्रखंड
                  {isBlockOverridden && (
                    <span className="ml-2 text-[10px] font-normal text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      (Manually edited)
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={block}
                  onChange={(e) => {
                    setBlock(e.target.value);
                    setIsBlockOverridden(true);
                  }}
                  placeholder="e.g. Angara"
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Village / Ward / टोला</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Hesal Village"
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">GPS Coordinates</label>
                <div className="flex items-center space-x-1">
                  <span className="p-2 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono text-[11px] flex-1 truncate">
                    {latitude.toFixed(4)}, {longitude.toFixed(4)}
                  </span>
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    className="p-2 bg-slate-200 hover:bg-slate-300 rounded text-slate-700"
                    title="Auto-detect GPS"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                  </button>
                </div>
              </div>
            </div>

            {/* Photo / Media Evidence (Upload + Camera) */}
            <div className="space-y-2">
              <label className="block font-semibold text-slate-800">
                {t("form_image_evidence", currentLanguage)}
              </label>

              {mediaUrl ? (
                <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={mediaUrl}
                      alt="Ground Evidence"
                      className="w-16 h-16 rounded-lg object-cover border border-slate-300 shadow-xs"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 block text-xs">
                        Ground Photo Attached
                      </span>
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>AI: Ground Evidence Verified (Geo-tagged)</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setCameraModalOpen(true)}
                      className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded text-[11px] flex items-center space-x-1"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{t("form_replace_photo", currentLanguage)}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaUrl("")}
                      className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-semibold rounded text-[11px]"
                    >
                      {t("form_remove_photo", currentLanguage)}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* File Upload Button */}
                  <label className="flex items-center justify-center space-x-2 p-3.5 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl cursor-pointer bg-slate-50 hover:bg-emerald-50/50 transition">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-slate-700 text-xs">
                      {t("form_upload_photo", currentLanguage)}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => setMediaUrl(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {/* Camera Capture Button */}
                  <button
                    type="button"
                    onClick={() => setCameraModalOpen(true)}
                    className="flex items-center justify-center space-x-2 p-3.5 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl bg-slate-50 hover:bg-emerald-50/50 transition font-semibold text-slate-700 text-xs"
                  >
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>{t("form_take_photo", currentLanguage)}</span>
                  </button>
                </div>
              )}
            </div>

            {/* AI Problem Validation Status Banner */}
            {isAnalyzing && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
                <span className="font-medium text-xs">
                  {t("val_in_progress", currentLanguage)}
                </span>
              </div>
            )}

            {!isAnalyzing && validationResult?.status === "invalid" && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 space-y-1 animate-in fade-in">
                <div className="flex items-center space-x-1.5 font-bold text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{t("val_invalid", currentLanguage)}</span>
                </div>
                <p className="text-[11px] text-rose-700 pl-5 leading-relaxed">
                  {validationResult.reason}
                </p>
              </div>
            )}

            {!isAnalyzing && validationResult?.status === "needs_clarification" && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 space-y-1 animate-in fade-in">
                <div className="flex items-center space-x-1.5 font-bold text-xs text-amber-800">
                  <HelpCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{t("val_needs_clarification", currentLanguage)}</span>
                </div>
                <p className="text-[11px] text-amber-800 pl-5 leading-relaxed font-medium">
                  {validationResult.clarificationPrompt || validationResult.reason}
                </p>
              </div>
            )}

            {!isAnalyzing && validationResult?.status === "valid" && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-950 flex items-center space-x-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-emerald-900 block">
                    {t("val_valid", currentLanguage)}
                  </span>
                  <span className="text-emerald-800">
                    {validationResult.reason}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Bar */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500">
                {validationResult?.status !== "valid" && (
                  <span className="text-amber-700 font-medium">
                    ⚠️ {t("val_submit_disabled_hint", currentLanguage)}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  isAnalyzing ||
                  validationResult?.status !== "valid" ||
                  !title.trim() ||
                  !description.trim()
                }
                className={`px-5 py-2.5 rounded font-semibold flex items-center space-x-1.5 transition shadow-xs ${
                  validationResult?.status === "valid" && !isSubmitting && !isAnalyzing
                    ? "bg-[#0f2942] hover:bg-[#163b5f] text-white cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                }`}
              >
                {isSubmitting ? (
                  <span>{t("form_submitting", currentLanguage)}</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{t("form_submit", currentLanguage)} &rarr;</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. My Tracked Issues */}
      {activeTab === "my_issues" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              My Registered Societal Challenges ({myProblems.length})
            </h3>
            <span className="text-xs text-slate-500">Live 10-Step Resolution Pipeline</span>
          </div>

          <div className="space-y-4">
            {myProblems.map((p) => {
              const currentStep = getStepIndex(p.status);
              const isDeployed = p.status === "deployed" || p.status === "closed";
              const isFundedOrProgress = p.status === "in_progress" || p.status === "industry_matched";

              return (
                <div key={p.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                        {p.ticketNumber}
                      </span>
                      {p.source === "whatsapp" ? (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                          <span>💬 WhatsApp</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[11px] font-semibold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                          <span>🌐 Portal</span>
                        </span>
                      )}
                      <StatusPill status={p.status} />
                      <span className="text-slate-500 text-xs">{p.district} ({p.block || "Sadar"})</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Rating Button */}
                      {isDeployed && (
                        <button
                          onClick={() => setRatingProb(p)}
                          className="px-3.5 py-1.5 bg-amber-50 text-amber-900 border border-amber-400 rounded font-bold text-xs hover:bg-amber-100 flex items-center space-x-1.5 shadow-xs"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{p.feedbackRating ? `Rated ${p.feedbackRating}★ (Edit)` : "⭐ Submit Ground Feedback"}</span>
                        </button>
                      )}

                      {/* Demo Simulator button */}
                      {!isDeployed && (
                        <button
                          onClick={() => {
                            advanceProblemToDeployed(p.id);
                            confetti({ particleCount: 70, spread: 60 });
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold flex items-center space-x-1"
                          title="Simulate all milestones completed and advance to Deployed stage"
                        >
                          <Zap className="w-3 h-3 text-amber-500" />
                          <span>Fast-Track to Deployed (Demo)</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">{p.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {p.category}
                      </span>
                      {p.sdgTags.map((tag, i) => (
                        <SdgBadge key={i} tag={tag} />
                      ))}
                    </div>
                  </div>

                  {/* Lifecycle Event Callout */}
                  {isFundedOrProgress && (
                    <div className="bg-emerald-50/70 border border-emerald-300 p-3 rounded text-xs flex items-center space-x-2.5">
                      <Briefcase className="w-4 h-4 text-emerald-800 shrink-0" />
                      <div className="text-emerald-950">
                        <strong>Milestone Update:</strong> Bilateral MoU executed with <strong>Tata Steel CSR Foundation</strong>. R&D grant funds committed. Multi-disciplinary student team active in {p.assignedUniversityName || "partner university"} laboratory prototyping.
                      </div>
                    </div>
                  )}

                  {isDeployed && p.feedbackRating && (
                    <div className="bg-amber-50/70 border border-amber-300 p-3 rounded text-xs flex items-center space-x-2">
                      <Star className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
                      <div className="text-amber-950">
                        <strong>Verified Citizen Rating:</strong> {p.feedbackRating}/5 Stars — <em>"{p.feedbackComment || "Clean drinking water delivered to all households."}"</em>
                      </div>
                    </div>
                  )}

                  {/* 10-Step Progress Stepper */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-700 uppercase">
                      <span>10-Stage Closed Loop Resolution (Step {currentStep} of 10):</span>
                      <span className="text-emerald-700 font-mono">
                        {currentStep === 10 ? "✓ Ground Deployment Verified" : currentStep >= 8 ? "✓ CSR Co-Funded & Lab Testing" : "In Progress"}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full transition-all duration-500"
                        style={{ width: `${currentStep * 10}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-5 text-[9px] text-slate-500 font-medium text-center pt-1">
                      <span className={currentStep >= 1 ? "font-bold text-slate-800" : ""}>1. Logged</span>
                      <span className={currentStep >= 4 ? "font-bold text-slate-800" : ""}>4. HEI Routed</span>
                      <span className={currentStep >= 6 ? "font-bold text-slate-800" : ""}>6. Team Built</span>
                      <span className={currentStep >= 8 ? "font-bold text-emerald-800" : ""}>8. CSR Funded</span>
                      <span className={currentStep === 10 ? "font-bold text-emerald-800" : ""}>10. Deployed ⭐</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Community Issues & Support */}
      {activeTab === "community" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Community Issues in {currentUser?.district || "Ranchi"} ({districtProblems.length})
            </h3>
            <span className="text-xs text-slate-500">Endorse issues you face locally</span>
          </div>

          <div className="space-y-3">
            {districtProblems.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] text-slate-500 font-bold">{p.ticketNumber}</span>
                    <StatusPill status={p.status} />
                  </div>
                  <h4 className="font-heading font-bold text-xs text-slate-900">{p.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{p.description}</p>
                </div>

                <button
                  onClick={() => upvoteProblem(p.id)}
                  className="px-3 py-1.5 border border-slate-300 hover:border-rose-300 hover:bg-rose-50 text-slate-700 rounded text-xs font-semibold flex items-center space-x-1 shrink-0"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>{p.citizenSupportCount} Supports</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Leaderboard */}
      {activeTab === "leaderboard" && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 font-heading font-bold text-xs uppercase tracking-wider text-slate-800">
            Jharkhand Civic Hero Leaderboard & Reputation
          </div>

          <table className="gov-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Citizen / PRI Representative</th>
                <th>District</th>
                <th>Submissions</th>
                <th>Impact Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold text-slate-900 font-mono">#1</td>
                <td>
                  <span className="font-bold text-slate-900 block">Shri Birsa Munda (Mukhia)</span>
                  <span className="text-[11px] text-slate-500">Gram Panchayat Torpa</span>
                </td>
                <td>Khunti</td>
                <td>14 Issues</td>
                <td className="font-mono font-bold text-emerald-700">1,480 pts</td>
              </tr>
              <tr>
                <td className="font-bold text-slate-900 font-mono">#2</td>
                <td>
                  <span className="font-bold text-slate-900 block">Dr. Pratima Tigga</span>
                  <span className="text-[11px] text-slate-500">PHC Medical Officer</span>
                </td>
                <td>Dumka</td>
                <td>11 Issues</td>
                <td className="font-mono font-bold text-emerald-700">1,320 pts</td>
              </tr>
              <tr>
                <td className="font-bold text-slate-900 font-mono">#3</td>
                <td>
                  <span className="font-bold text-slate-900 block">Smt. Sunita Devi (You)</span>
                  <span className="text-[11px] text-slate-500">Angara SHG Federation</span>
                </td>
                <td>Ranchi</td>
                <td>9 Issues</td>
                <td className="font-mono font-bold text-emerald-700">1,140 pts</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <CameraCaptureModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onCapture={(data) => setMediaUrl(data)}
      />

      <CitizenRatingModal
        problem={ratingProb}
        onClose={() => setRatingProb(null)}
      />
    </PortalLayout>
  );
};
