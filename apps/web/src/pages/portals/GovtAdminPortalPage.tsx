import React, { useState } from "react";
import { PortalLayout, NavItem } from "../../components/layout/PortalLayout";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { JharkhandHeatmap } from "../../components/analytics/JharkhandHeatmap";
import { AnalyticsCharts } from "../../components/analytics/AnalyticsCharts";
import { ExplainableAIModal } from "../../components/ai/ExplainableAIModal";
import { BlockchainLedgerModal } from "../../components/lifecycle/BlockchainLedgerModal";
import { StatusPill } from "../../components/common/StatusPill";
import { getAiRoutingRecommendations, UNIVERSITY_ECOSYSTEMS } from "../../data/universityEcosystems";
import {
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  BrainCircuit,
  MapPin,
  Download,
  FileSpreadsheet,
  Layers,
  Building,
  AlertCircle
} from "lucide-react";
import confetti from "canvas-confetti";

export const GovtAdminPortalPage: React.FC = () => {
  const { problems, universities, agreements, proposals, milestones, approveMilestoneGovt, currentUser, selectedDistrict, setSelectedDistrict } = useApp();
  const [activeTab, setActiveTab] = useState("apex_overview");
  const [selectedProbForXAI, setSelectedProbForXAI] = useState<any>(null);
  const [blockchainModalOpen, setBlockchainModalOpen] = useState(false);

  // Issues pending human nodal validation
  const pendingValidation = problems.filter((p) => p.status === "pending_nodal_review" || p.status === "under_ai_review");

  const navItems: NavItem[] = [
    { id: "apex_overview", label: "State Command KPIs", icon: BarChart3 },
    { id: "heatmap", label: "24-District Geo Heatmap", icon: MapPin },
    { id: "ai_gate", label: "Human AI Validation Gate", icon: BrainCircuit, badge: pendingValidation.length },
    { id: "dual_signoff", label: "Milestone Dual Sign-Off", icon: ShieldCheck },
    { id: "blockchain", label: "Blockchain Fund Ledger", icon: Layers },
    { id: "reports", label: "Official Reports & Export", icon: Download }
  ];

  const handleExportPDF = () => {
    alert("Exporting Executive Jharkhand Societal Innovation BI Report (Official PDF)...");
  };

  const handleExportExcel = () => {
    alert("Exporting District & University Innovation Ledger (.xlsx)...");
  };

  return (
    <PortalLayout
      portalTitle="State Apex Command & District Portal"
      portalSubtitle="राज्य शीर्ष नवाचार एवं जिला दंडाधिकारी पटल — Dr. Shailesh Kumar, IAS"
      navItems={navItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* 1. Apex Overview */}
      {activeTab === "apex_overview" && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Higher & Technical Education Department
              </span>
              <h3 className="font-heading font-bold text-base text-slate-900 mt-0.5">
                Jharkhand State Societal Innovation Apex Command
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Real-time governance dashboard monitoring societal challenges across all 24 districts, academic research throughput, and CSR co-investment.
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleExportPDF}
                className="px-3 py-1.5 bg-[#0f2942] hover:bg-[#163b5f] text-white text-xs font-semibold rounded flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={handleExportExcel}
                className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded flex items-center space-x-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel</span>
              </button>
            </div>
          </div>

          {/* Key State Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Total State Issues</span>
              <span className="font-mono font-bold text-2xl text-slate-900 mt-1 block">
                {problems.length + 580}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">↑ 18% this month</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Active HEI Projects</span>
              <span className="font-mono font-bold text-2xl text-blue-800 mt-1 block">
                66 Projects
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">BIT, IIT ISM, NIT, BAU</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">CSR Funds Mobilized</span>
              <span className="font-mono font-bold text-2xl text-emerald-800 mt-1 block">
                ₹52.8 Lakhs
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">100% On-Chain</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Field Deployed Fixes</span>
              <span className="font-mono font-bold text-2xl text-purple-800 mt-1 block">
                146 Fixes
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">4.9★ Citizen Rating</span>
            </div>
          </div>

          {/* 24 District Heatmap preview */}
          <JharkhandHeatmap
            selectedDistrict={selectedDistrict}
            onSelectDistrict={(d) => setSelectedDistrict(d)}
          />

          {/* Visual Analytics */}
          <AnalyticsCharts />
        </div>
      )}

      {/* 2. 24-District Heatmap */}
      {activeTab === "heatmap" && (
        <div className="space-y-4">
          <JharkhandHeatmap
            selectedDistrict={selectedDistrict}
            onSelectDistrict={(d) => setSelectedDistrict(d)}
          />
        </div>
      )}

      {/* 3. Human AI Triage Validation Gate */}
      {activeTab === "ai_gate" && (
        <div className="space-y-4 text-xs">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Human-in-the-Loop AI Validation Desk ({pendingValidation.length})
              </h3>
              <p className="text-slate-500 text-[11px]">
                Review AI-generated categorization, priority scores, and university routing before final dispatch
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {pendingValidation.map((p) => {
              const recs = getAiRoutingRecommendations(p.category, p.title, p.description, p.district);
              const isHealth =
                p.category === "Healthcare & MedTech" ||
                `${p.title} ${p.description}`.toLowerCase().includes("fever") ||
                `${p.title} ${p.description}`.toLowerCase().includes("flew") ||
                `${p.title} ${p.description}`.toLowerCase().includes("flu") ||
                `${p.title} ${p.description}`.toLowerCase().includes("virus");

              const isMining =
                p.category === "Environment & Mining Remediation" ||
                `${p.title} ${p.description}`.toLowerCase().includes("coal") ||
                `${p.title} ${p.description}`.toLowerCase().includes("mining");

              const topMatch = (() => {
                if (p.aiExplanation?.suggestedUniversities && p.aiExplanation.suggestedUniversities.length > 0) {
                  const existingTop = p.aiExplanation.suggestedUniversities[0];
                  if (isHealth && existingTop.universityId !== "univ-aiims-deoghar") {
                    return recs[0];
                  }
                  if (isMining && existingTop.universityId !== "univ-iit-dhanbad") {
                    return recs[0];
                  }
                  return existingTop;
                }
                return recs[0];
              })();

              const domainBadge =
                UNIVERSITY_ECOSYSTEMS[topMatch.universityId]?.domainName || p.category;

              const matchPct = Math.round(topMatch.score > 1 ? topMatch.score : topMatch.score * 100);

              return (
                <div key={p.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
                  <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{p.ticketNumber}</span>
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
                      <span className="text-slate-500">District: {p.district}</span>
                    </div>

                    <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      AI Priority: {p.priorityScore}/100
                    </span>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">{p.title}</h4>
                    <p className="text-slate-600 mt-1 leading-relaxed">{p.description}</p>
                  </div>

                  <div className="bg-blue-50/60 p-3 rounded border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-blue-950 text-xs">AI Recommended Academic Routing:</span>
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          AI Best Match ({matchPct}% Fit)
                        </span>
                      </div>
                      <span className="text-blue-900 font-semibold text-xs mt-0.5 block">
                        #{topMatch.rank || 1} {topMatch.universityName} ({matchPct}% Match) • {domainBadge}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedProbForXAI(p)}
                      className="px-3 py-1.5 bg-[#0f2942] text-white rounded font-semibold flex items-center space-x-1 shrink-0 text-xs"
                    >
                      <BrainCircuit className="w-3.5 h-3.5" />
                      <span>Inspect Explainable AI & Confirm &rarr;</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Milestone Dual Sign-Off Gate */}
      {activeTab === "dual_signoff" && (
        <div className="space-y-4 text-xs">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Government District Officer Sign-Off & Escrow Fund Authorization Gate
            </h3>
            <p className="text-slate-500 text-[11px]">
              Dual sign-off authorization releasing tranche grants to university research escrow accounts and advancing problem status to Deployed.
            </p>
          </div>

          <div className="space-y-4">
            {milestones.map((m) => {
              const targetProp = proposals.find((p) => p.id === m.proposalId) || proposals[0];
              const isApproved = m.govtApproved;

              return (
                <div
                  key={m.id}
                  className={`bg-white p-5 rounded-lg border shadow-xs space-y-3 transition ${
                    isApproved ? "border-emerald-300 bg-emerald-50/10" : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <span className="font-mono text-slate-500 text-[11px] block">
                        Project: {targetProp?.title || "Active Research Cohort"} ({targetProp?.universityName || "Participating HEI"})
                      </span>
                      <h4 className="font-heading font-bold text-slate-900 text-sm mt-0.5">
                        {m.displayName}
                      </h4>
                    </div>

                    <div>
                      {isApproved ? (
                        <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2.5 py-1 rounded text-[11px] flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>DISTRICT STAMP APPLIED & TRANCHE RELEASED</span>
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded text-[10px]">
                          ACTION REQUIRED: PENDING DISTRICT STAMP
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed text-[11px]">{m.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-500">1. Faculty Academic Sign-Off:</span>
                      <span className={m.facultyApproved ? "font-bold text-emerald-800" : "text-amber-700 font-semibold"}>
                        {m.facultyApproved ? `Approved by ${m.facultyApprovedBy || "Faculty"} ✓` : "⏳ Pending Faculty Stamp"}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center justify-between">
                      <span className="text-slate-500">Tranche Grant to Disburse:</span>
                      <span className="font-mono font-bold text-slate-900">₹{((m.index * 65000) + 35000).toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-slate-500 text-[11px]">
                      Authorized Officer: <strong>Dr. Shailesh Kumar, IAS (State Project Director)</strong>
                    </span>

                    {!isApproved ? (
                      <button
                        onClick={() => {
                          approveMilestoneGovt(m.id, currentUser?.fullName || "Dr. Shailesh Kumar, IAS");
                          confetti({ particleCount: 80, spread: 70 });
                        }}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded flex items-center space-x-1.5 shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Apply Government Sign-Off Stamp & Release Tranche</span>
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Recorded in Blockchain Ledger Block #3891</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Blockchain Ledger Explorer */}
      {activeTab === "blockchain" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Immutable Cryptographic Milestone & CSR Fund Audit Trail
              </h3>
              <p className="text-xs text-slate-500">
                SHA-256 hash chains verifying all problem submissions, MoUs, and public disbursements
              </p>
            </div>
            <button
              onClick={() => setBlockchainModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#0f2942] text-white text-xs font-semibold rounded hover:bg-[#163b5f]"
            >
              Open Full Blockchain Explorer &rarr;
            </button>
          </div>
        </div>
      )}

      {/* 6. Reports & Export */}
      {activeTab === "reports" && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-heading font-bold text-sm text-slate-900">
            Official Executive BI Reports & Circular Exporter
          </h3>
          <p className="text-slate-600">
            Generate formal Government of Jharkhand Directorate of Higher Education innovation reports for State Cabinet and District Planning Committees.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-[#0f2942] text-white font-semibold rounded flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Comprehensive Annual State Innovation Report (PDF)</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded hover:bg-slate-50 flex items-center space-x-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Raw Data (.xlsx)</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <ExplainableAIModal
        problem={selectedProbForXAI}
        onClose={() => setSelectedProbForXAI(null)}
      />

      {blockchainModalOpen && (
        <BlockchainLedgerModal onClose={() => setBlockchainModalOpen(false)} />
      )}
    </PortalLayout>
  );
};
