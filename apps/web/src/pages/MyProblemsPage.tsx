import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { StatusPill } from "../components/common/StatusPill";
import { SdgBadge } from "../components/common/SdgBadge";
import { ExplainableAIModal } from "../components/ai/ExplainableAIModal";
import { CitizenRatingModal } from "../components/citizen/CitizenRatingModal";
import {
  FileText,
  MapPin,
  CheckCircle2,
  Clock,
  Heart,
  Star,
  BrainCircuit,
  Eye,
  Building,
  ChevronRight,
  Sparkles
} from "lucide-react";

export const MyProblemsPage: React.FC = () => {
  const { problems, currentUser, upvoteProblem } = useApp();
  const [selectedProbForXAI, setSelectedProbForXAI] = useState<any>(null);
  const [selectedProbForRating, setSelectedProbForRating] = useState<any>(null);
  const [filterView, setFilterView] = useState<"my" | "all">("all");

  const displayedProblems = filterView === "my"
    ? problems.filter((p) => p.submittedBy === currentUser.id)
    : problems;

  const getStepIndex = (status: string) => {
    switch (status) {
      case "submitted": return 1;
      case "under_ai_review": return 2;
      case "pending_nodal_review": return 3;
      case "routed": return 4;
      case "accepted_by_hei": return 5;
      case "team_formed": return 6;
      case "in_progress": return 7;
      case "industry_matched": return 8;
      case "field_pilot": return 9;
      case "deployed":
      case "closed": return 10;
      default: return 1;
    }
  };

  const stepsList = [
    "Submitted",
    "AI Triage",
    "Nodal Gate",
    "HEI Routed",
    "HEI Accepted",
    "Team Formed",
    "Prototyping",
    "Industry MoU",
    "Field Pilot",
    "Deployed & Rated"
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
            Societal Challenge Status Tracker
          </h1>
          <p className="text-xs text-slate-500">
            Step-by-step transparency from submission to academic research, industry funding, and community deployment
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs">
            <button
              onClick={() => setFilterView("all")}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterView === "all" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600"
              }`}
            >
              All State Challenges ({problems.length})
            </button>
            <button
              onClick={() => setFilterView("my")}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterView === "my" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600"
              }`}
            >
              My Submissions
            </button>
          </div>

          <Link
            to="/submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            + New Challenge
          </Link>
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-6">
        {displayedProblems.map((prob) => {
          const currentStep = getStepIndex(prob.status);

          return (
            <div
              key={prob.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-5"
            >
              {/* Top Meta Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">
                    {prob.ticketNumber}
                  </span>
                  {prob.source === "whatsapp" ? (
                    <span className="inline-flex items-center space-x-1 text-xs font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <span>💬 WhatsApp</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-xs font-semibold bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200">
                      <span>🌐 Portal</span>
                    </span>
                  )}
                  <StatusPill status={prob.status} />
                  <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{prob.district} ({prob.block || "Block"})</span>
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Reported by <strong>{prob.submitterName}</strong>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedProbForXAI(prob)}
                    className="flex items-center space-x-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-xl transition"
                  >
                    <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Inspect Explainable AI &rarr;</span>
                  </button>

                  {(prob.status === "deployed" || prob.status === "closed") && (
                    <button
                      onClick={() => setSelectedProbForRating(prob)}
                      className="flex items-center space-x-1 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl transition"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{prob.feedbackRating ? `Rated ${prob.feedbackRating}★` : "Rate Solution ★"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Body */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                    {prob.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {prob.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-xs bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded font-medium border border-emerald-200">
                      Domain: {prob.category}
                    </span>
                    {prob.sdgTags.map((tag, i) => (
                      <SdgBadge key={i} tag={tag} />
                    ))}
                  </div>

                  {/* Ground Feedback Box if Deployed */}
                  {prob.feedbackComment && (
                    <div className="bg-teal-50 border border-teal-200 p-3 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-teal-950 flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>Citizen Verified Community Impact:</span>
                      </span>
                      <p className="text-teal-900 italic">"{prob.feedbackComment}"</p>
                    </div>
                  )}
                </div>

                {/* Right Side Stats & Image */}
                <div className="space-y-3">
                  {prob.media && prob.media[0] && (
                    <div className="h-32 rounded-xl overflow-hidden border border-slate-200">
                      <img src={prob.media[0].storageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>AI Priority Score:</span>
                      <span className="font-mono font-bold text-amber-700">{prob.priorityScore}/100</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Assigned HEI:</span>
                      <span className="font-bold text-slate-900 truncate max-w-[150px]">
                        {prob.assignedUniversityName || "Pending Nodal Review"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                      <button
                        onClick={() => upvoteProblem(prob.id)}
                        className="flex items-center space-x-1 text-slate-700 hover:text-rose-600 text-xs font-semibold"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        <span>{prob.citizenSupportCount} Me-Too Endorsements</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 10-Step Progress Stepper Visualizer */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Closed-Loop Lifecycle Progress ({currentStep}/10 Steps Completed):
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1 text-center">
                  {stepsList.map((stepName, sIdx) => {
                    const stepNum = sIdx + 1;
                    const isCompleted = currentStep >= stepNum;
                    const isCurrent = currentStep === stepNum;

                    return (
                      <div
                        key={stepName}
                        className={`p-2 rounded-xl border text-[10px] font-medium transition flex flex-col items-center justify-between ${
                          isCurrent
                            ? "bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-400/40 shadow-xs font-bold"
                            : isCompleted
                            ? "bg-emerald-50 text-emerald-900 border-emerald-200 font-semibold"
                            : "bg-slate-50 text-slate-400 border-slate-200"
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] mb-1 font-bold ${
                          isCurrent ? "bg-white text-emerald-700" : isCompleted ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                        }`}>
                          {stepNum}
                        </span>
                        <span className="leading-tight">{stepName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <ExplainableAIModal
        problem={selectedProbForXAI}
        onClose={() => setSelectedProbForXAI(null)}
      />

      <CitizenRatingModal
        problem={selectedProbForRating}
        onClose={() => setSelectedProbForRating(null)}
      />
    </div>
  );
};
