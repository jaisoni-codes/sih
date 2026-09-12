import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  UserRole,
  Problem,
  University,
  Team,
  TeamMember,
  Proposal,
  Agreement,
  Milestone,
  KanbanTask,
  NotificationItem,
  BlockchainLedgerBlock,
  DistrictGeoData,
  ProblemStatus,
  MilestoneStatus,
  DocumentVaultItem,
  StudentDeliverableTask
} from "../types";
import { useAuth } from "./AuthContext";
import { getAiRoutingRecommendations, getDomainKeywordsAndTags } from "../data/universityEcosystems";
import {
  MOCK_USERS,
  MOCK_PROBLEMS,
  MOCK_UNIVERSITIES,
  MOCK_TEAMS,
  MOCK_PROPOSALS,
  MOCK_AGREEMENTS,
  MOCK_MILESTONES,
  MOCK_KANBAN_TASKS,
  MOCK_NOTIFICATIONS,
  MOCK_BLOCKCHAIN_LEDGER,
  JHARKHAND_DISTRICTS
} from "../data/mockData";

export interface AppContextType {
  currentUser: User;
  allUsers: Record<string, User>;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  
  problems: Problem[];
  submitProblem: (newProb: Partial<Problem>) => Problem;
  upvoteProblem: (problemId: string) => void;
  updateProblemStatus: (problemId: string, newStatus: ProblemStatus, assignedUnivId?: string, assignedFacultyId?: string) => void;
  rateProblem: (problemId: string, rating: number, comment: string) => void;
  advanceProblemToDeployed: (problemId: string) => void;
  
  universities: University[];
  teams: Team[];
  createTeam: (team: Omit<Team, "id" | "createdAt">) => Team;
  addTeamMember: (teamId: string, member: Omit<TeamMember, "id" | "teamId">) => void;
  
  proposals: Proposal[];
  createProposal: (proposal: Omit<Proposal, "id" | "submittedAt">) => Proposal;
  updateProposalStatus: (proposalId: string, status: Proposal["status"]) => void;
  
  agreements: Agreement[];
  createAgreement: (agreement: Omit<Agreement, "id" | "signedAt" | "blockchainTxHash">) => Agreement;
  
  milestones: Milestone[];
  updateMilestoneStatus: (milestoneId: string, status: MilestoneStatus) => void;
  approveMilestoneFaculty: (milestoneId: string, approverName: string) => void;
  approveMilestoneGovt: (milestoneId: string, approverName: string) => void;
  uploadMilestoneDocument: (milestoneId: string, doc: Omit<DocumentVaultItem, "id" | "uploadedAt">) => void;
  
  studentDeliverables: StudentDeliverableTask[];
  assignStudentTask: (task: Omit<StudentDeliverableTask, "id">) => void;
  submitStudentDeliverable: (taskId: string, progressPercent: number, notes: string, pdfUrl?: string) => void;
  reviewStudentDeliverable: (taskId: string, decision: "accept" | "reject", feedback: string, approverName: string) => void;
  kanbanTasks: KanbanTask[];
  updateTaskStatus: (taskId: string, newStatus: KanbanTask["status"]) => void;
  createTask: (task: Omit<KanbanTask, "id">) => void;
  
  notifications: NotificationItem[];
  markNotificationAsRead: (notifId: string) => void;
  triggerNotification: (notif: Omit<NotificationItem, "id" | "sentAt">) => void;
  
  blockchainLedger: BlockchainLedgerBlock[];
  addBlockchainBlock: (block: Omit<BlockchainLedgerBlock, "blockNumber" | "timestamp" | "previousHash" | "currentHash">) => void;
  
  districts: DistrictGeoData[];
  selectedDistrict: string;
  setSelectedDistrict: (districtId: string) => void;
  
  currentLanguage: "en" | "hi" | "nagpuri" | "santali";
  setCurrentLanguage: (lang: "en" | "hi" | "nagpuri" | "santali") => void;
  
  isOnline: boolean;
  offlineQueue: any[];
  syncOfflineQueue: () => void;
  
  inspectingProblem: Problem | null;
  setInspectingProblem: (prob: Problem | null) => void;
  
  chatbotOpen: boolean;
  setChatbotOpen: (open: boolean) => void;
  whatsappSimulatorOpen: boolean;
  setWhatsappSimulatorOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);


const INITIAL_STUDENT_DELIVERABLES: StudentDeliverableTask[] = [
  {
    id: "dt-001",
    proposalId: "prop-001",
    proposalTitle: "JalShuddhi: Solar-Powered Nano-Adsorptive Fluoride Filter",
    milestoneId: "ms-002",
    milestoneName: "Milestone 2: Prototype Fabrication & Lab Bench Testing",
    title: "ESP32 Embedded Firmware & LoRaWAN Node Assembly",
    description: "Program ESP32 to read optical turbidity & conductivity sensors and transmit every 15 mins.",
    assignedStudentId: "student-rahul",
    assignedStudentName: "Rahul Kumar (Team Lead)",
    studentDiscipline: "Electronics & IoT Engineering",
    progressPercent: 85,
    status: "in_progress",
    submissionNotes: "Bench prototype breadboard completed, working on waterproof housing."
  },
  {
    id: "dt-002",
    proposalId: "prop-001",
    proposalTitle: "JalShuddhi: Solar-Powered Nano-Adsorptive Fluoride Filter",
    milestoneId: "ms-002",
    milestoneName: "Milestone 2: Prototype Fabrication & Lab Bench Testing",
    title: "MQTT Cloud Broker & Real-Time Dashboard Integration",
    description: "Build state dashboard ingestion stream with automatic alert triggers when fluoride > 1.0 ppm.",
    assignedStudentId: "student-priya",
    assignedStudentName: "Priya Sharma (Student)",
    studentDiscipline: "Computer Science & Engineering",
    progressPercent: 100,
    status: "in_review_by_faculty",
    pdfUrl: "/vault/mqtt_cloud_telemetry_report.pdf",
    submissionNotes: "AWS IoT core hooked up to JSICP database. 100% packets received in 48-hr stress test.",
    submittedAt: "2026-03-02T14:30:00Z"
  },
  {
    id: "dt-003",
    proposalId: "prop-001",
    proposalTitle: "JalShuddhi: Solar-Powered Nano-Adsorptive Fluoride Filter",
    milestoneId: "ms-003",
    milestoneName: "Milestone 3: Field Testing & Pilot Calibration in District",
    title: "14-Day NABL Laboratory Water Fluoride Stress Test",
    description: "Continuous flow testing of activated alumina nano-adsorbent cartridge matrix using Angara borewell samples.",
    assignedStudentId: "student-sneha",
    assignedStudentName: "Sneha Soren (Student)",
    studentDiscipline: "Chemical & Environmental Engineering",
    progressPercent: 100,
    status: "in_review_by_faculty",
    pdfUrl: "/vault/nabl_certified_water_fluoride_titration_sheet.pdf",
    submissionNotes: "Fluoride level dropped from 6.8 ppm down to 0.42 ppm (well within BIS 10500 standard of 1.0 ppm). NABL certified report attached.",
    submittedAt: "2026-03-03T11:00:00Z"
  },
  {
    id: "dt-004",
    proposalId: "prop-001",
    proposalTitle: "JalShuddhi: Solar-Powered Nano-Adsorptive Fluoride Filter",
    milestoneId: "ms-001",
    milestoneName: "Milestone 1: Research, Chemical Formulation & 3D CAD Design",
    title: "Dual-Cartridge Modular Chamber 3D CAD Blueprint",
    description: "CAD mechanical design of quick-swap cartridge housing compatible with standard Mark-II handpumps.",
    assignedStudentId: "student-amit",
    assignedStudentName: "Amit Verma (Student)",
    studentDiscipline: "Mechanical Engineering",
    progressPercent: 100,
    status: "approved_by_faculty",
    pdfUrl: "/vault/mark2_handpump_cartridge_cad_blueprint.pdf",
    submissionNotes: "3D CAD model stress-analyzed for 15 bar pressure. Passed mechanical safety guidelines.",
    facultyFeedback: "Excellent dimensional tolerance and ergonomic latch design. Approved for lab CNC milling.",
    facultySignedAt: "2026-02-20T16:00:00Z",
    facultySignedBy: "Prof. Ananya Sen"
  },
  // IIT (ISM) Dhanbad Deliverables
  {
    id: "dt-iit-001",
    proposalId: "prop-003",
    proposalTitle: "AgniShanti: Autonomous Thermal Drone & Fly-Ash Slurry Micro-Capping for Coal Fires",
    milestoneId: "ms-001",
    milestoneName: "Milestone 1: Drone Thermal Survey & Underground Fire Boundary Mapping",
    title: "Hexacopter Thermal FLIR Radiometric Survey & Hotspot GeoTIFF",
    description: "Execute 5 autonomous UAV thermal grid flights over Ghanudih opencast seam to detect subsurface combustion hotspots > 120°C.",
    assignedStudentId: "student-iit-rohan",
    assignedStudentName: "Rohan Deshmukh (Team Lead)",
    studentDiscipline: "Mining Machinery & Robotics",
    progressPercent: 100,
    status: "in_review_by_faculty",
    pdfUrl: "/vault/jharia_coal_seam_thermal_radiometric_survey_v1.pdf",
    submissionNotes: "Completed night thermal flights over Jharia Ghanudih. 14 critical hot spots identified with GPS coordinates. GeoTIFF dataset and flight telemetry logs attached.",
    submittedAt: "2026-03-03T18:00:00Z"
  },
  {
    id: "dt-iit-002",
    proposalId: "prop-003",
    proposalTitle: "AgniShanti: Autonomous Thermal Drone & Fly-Ash Slurry Micro-Capping for Coal Fires",
    milestoneId: "ms-002",
    milestoneName: "Milestone 2: Fly-Ash Geopolymer Slurry Formulation & Viscosity Testing",
    title: "Geopolymer Slurry Rheology & Thermal Retardant Lab Analysis",
    description: "Bench testing slurry viscosity at 200°C to verify surface crack sealing without thermal decomposition.",
    assignedStudentId: "student-iit-ananya",
    assignedStudentName: "Ananya Sengupta (Student)",
    studentDiscipline: "Applied Geophysics & AI",
    progressPercent: 90,
    status: "in_progress",
    submissionNotes: "Mix ratio 3:1 fly-ash to sodium silicate tested. Thermal retardance validated up to 350°C in Dhanbad high-temp lab."
  },
  {
    id: "dt-iit-003",
    proposalId: "prop-003",
    proposalTitle: "AgniShanti: Autonomous Thermal Drone & Fly-Ash Slurry Micro-Capping for Coal Fires",
    milestoneId: "ms-001",
    milestoneName: "Milestone 1: Drone Thermal Survey & Underground Fire Boundary Mapping",
    title: "Subsurface Methane & CO Sensor Mesh Node Prototyping",
    description: "LoRaWAN gas monitoring probes to be placed near subsidence cracks in Jharia basti.",
    assignedStudentId: "student-iit-vikas",
    assignedStudentName: "Vikas Mahto (Student)",
    studentDiscipline: "Computer Science & Mining Systems",
    progressPercent: 100,
    status: "approved_by_faculty",
    pdfUrl: "/vault/lora_methane_node_bench_test_results.pdf",
    submissionNotes: "Gas probes calibrated against reference methane chamber. Zero packet loss over 3.2km range.",
    facultyFeedback: "Excellent calibration curve and LoRa link budget. Approved for pilot field deployment.",
    facultySignedAt: "2026-02-26T14:00:00Z",
    facultySignedBy: "Prof. Arvind Mukhopadhyay"
  },

  // AIIMS Deoghar Deliverables
  {
    id: "dt-aiims-001",
    proposalId: "prop-004",
    proposalTitle: "SwasthyaVahak: Smart PCM Solar Vaccine Carrier with LoRa Telemetry & GPS Geofencing",
    milestoneId: "ms-001",
    milestoneName: "Milestone 1: PCM Thermal Retention Testing & Ergonomic Enclosure",
    title: "72-Hour Ambient Chamber Temperature Stress Evaluation (45°C External)",
    description: "Validate vaccine internal chamber holds 2°C-8°C under direct solar simulation without external grid power.",
    assignedStudentId: "student-aiims-deepak",
    assignedStudentName: "Dr. Deepak Soren (Team Lead)",
    studentDiscipline: "Centre for Community Medicine & MedTech Devices",
    progressPercent: 100,
    status: "in_review_by_faculty",
    pdfUrl: "/vault/aiims_deoghar_vaccine_cold_chain_stress_test.pdf",
    submissionNotes: "Vaccine chamber maintained 4.1°C average across 72 continuous hours at 45°C external ambient heat. Full data sheet attached.",
    submittedAt: "2026-03-03T16:20:00Z"
  },
  {
    id: "dt-aiims-002",
    proposalId: "prop-004",
    proposalTitle: "SwasthyaVahak: Smart PCM Solar Vaccine Carrier with LoRa Telemetry & GPS Geofencing",
    milestoneId: "ms-002",
    milestoneName: "Milestone 2: Telemetry Node & Geofence SMS Integration",
    title: "Biomedical Temperature Telemetry & GSM Breach Alert Unit",
    description: "Fabricate PCB board with digital PT100 temperature sensor and GSM transmitter.",
    assignedStudentId: "student-aiims-kavita",
    assignedStudentName: "Kavita Tirkey (Student)",
    studentDiscipline: "Biomedical Engineering & Tele-Health",
    progressPercent: 80,
    status: "in_progress",
    submissionNotes: "Firmware flashing completed, integrating buzzer alarm for lid open breach."
  },

  // BAU Ranchi Deliverables
  {
    id: "dt-bau-001",
    proposalId: "prop-002",
    proposalTitle: "VanDhan SolarLac: Portable Hybrid Solar Scraping & Deseeding Machine",
    milestoneId: "ms-001",
    milestoneName: "Milestone 1: Mechanical Deseeding Drum & Solar Drive Prototyping",
    title: "Rotary Blade Scraper Speed & Seed Damage Optimization Report",
    description: "Calibrate cutting speed to ensure <2% broodlac damage during automated peeling.",
    assignedStudentId: "student-bau-birsa",
    assignedStudentName: "Birsa Oraon (Team Lead)",
    studentDiscipline: "Agricultural Engineering & Soil Sensors",
    progressPercent: 100,
    status: "in_review_by_faculty",
    pdfUrl: "/vault/bau_solarlac_scraping_efficiency_trial.pdf",
    submissionNotes: "Prototype achieved 26.4 kg/hr processing speed with 98.8% seed integrity. Testing video and CAD spec sheet uploaded.",
    submittedAt: "2026-03-02T19:15:00Z"
  },
  {
    id: "dt-bau-002",
    proposalId: "prop-002",
    proposalTitle: "VanDhan SolarLac: Portable Hybrid Solar Scraping & Deseeding Machine",
    milestoneId: "ms-002",
    milestoneName: "Milestone 2: Field SHG Training & Moisture Drying Chamber",
    title: "Torpa Tribal Women SHG Ergonomics & Solar Dryer Field Manual",
    description: "Translate operating instructions into Ho and Mundari with pictorial safety guides.",
    assignedStudentId: "student-bau-pooja",
    assignedStudentName: "Pooja Kumari (Student)",
    studentDiscipline: "Centre for Bio-Inoculants & Post-Harvest Tech",
    progressPercent: 75,
    status: "in_progress",
    submissionNotes: "First draft reviewed with Torpa SHG federation. Formatting final laminate cards."
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser: authUser } = useAuth();
  // Load state or fallback to mocks
  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (authUser) return authUser;
    const saved = localStorage.getItem("jsicp_current_user_id");
    return saved && MOCK_USERS[saved] ? MOCK_USERS[saved] : MOCK_USERS["citizen-sunita"];
  });

  useEffect(() => {
    if (authUser) {
      setCurrentUser(authUser);
    }
  }, [authUser]);

  const [problems, setProblems] = useState<Problem[]>(() => {
    const saved = localStorage.getItem("jsicp_problems");
    return saved ? JSON.parse(saved) : MOCK_PROBLEMS;
  });

  const [universities, setUniversities] = useState<University[]>(MOCK_UNIVERSITIES);
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem("jsicp_teams");
    return saved ? JSON.parse(saved) : MOCK_TEAMS;
  });

  const [proposals, setProposals] = useState<Proposal[]>(() => {
    const saved = localStorage.getItem("jsicp_proposals");
    return saved ? JSON.parse(saved) : MOCK_PROPOSALS;
  });

  const [agreements, setAgreements] = useState<Agreement[]>(() => {
    const saved = localStorage.getItem("jsicp_agreements");
    return saved ? JSON.parse(saved) : MOCK_AGREEMENTS;
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem("jsicp_milestones");
    return saved ? JSON.parse(saved) : MOCK_MILESTONES;
  });

  const [studentDeliverables, setStudentDeliverables] = useState<StudentDeliverableTask[]>(() => {
    const saved = localStorage.getItem("jsicp_student_deliverables");
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_DELIVERABLES;
  });

  useEffect(() => {
    localStorage.setItem("jsicp_student_deliverables", JSON.stringify(studentDeliverables));
  }, [studentDeliverables]);
  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>(() => {
    const saved = localStorage.getItem("jsicp_kanban_tasks");
    return saved ? JSON.parse(saved) : MOCK_KANBAN_TASKS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [blockchainLedger, setBlockchainLedger] = useState<BlockchainLedgerBlock[]>(MOCK_BLOCKCHAIN_LEDGER);
  const [districts] = useState<DistrictGeoData[]>(JHARKHAND_DISTRICTS);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [currentLanguage, setCurrentLanguageState] = useState<"en" | "hi" | "nagpuri" | "santali">(() => {
    return (localStorage.getItem("jsicp_lang") as any) || "en";
  });
  const setCurrentLanguage = (lang: "en" | "hi" | "nagpuri" | "santali") => {
    setCurrentLanguageState(lang);
    localStorage.setItem("jsicp_lang", lang);
  };
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [inspectingProblem, setInspectingProblem] = useState<Problem | null>(null);
  const [chatbotOpen, setChatbotOpen] = useState<boolean>(false);
  const [whatsappSimulatorOpen, setWhatsappSimulatorOpen] = useState<boolean>(false);


  // Self-heal any existing or persisted problems in state so Healthcare/fever problems route to AIIMS Deoghar
  useEffect(() => {
    setProblems((prev) =>
      prev.map((p) => {
        const text = `${p.title} ${p.description} ${p.category}`.toLowerCase();
        const isHealth =
          p.category === "Healthcare & MedTech" ||
          text.includes("fever") ||
          text.includes("flew") ||
          text.includes("flu") ||
          text.includes("virus");

        if (isHealth && p.aiExplanation?.suggestedUniversities?.[0]?.universityId !== "univ-aiims-deoghar") {
          const recs = getAiRoutingRecommendations("Healthcare & MedTech", p.title, p.description, p.district);
          return {
            ...p,
            category: "Healthcare & MedTech",
            aiExplanation: {
              ...p.aiExplanation,
              nlpKeywords: ["fever", "epidemic", "viral_outbreak", "public_health", p.district || "Ranchi"],
              cvSceneTags: ["clinical anomaly", "patient surge", "syndromic cluster"],
              suggestedUniversities: recs
            } as any
          };
        }
        return p;
      })
    );
  }, []);
  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("jsicp_problems", JSON.stringify(problems));
  }, [problems]);

  useEffect(() => {
    localStorage.setItem("jsicp_proposals", JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem("jsicp_milestones", JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem("jsicp_agreements", JSON.stringify(agreements));
  }, [agreements]);

  useEffect(() => {
    localStorage.setItem("jsicp_teams", JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem("jsicp_kanban_tasks", JSON.stringify(kanbanTasks));
  }, [kanbanTasks]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const switchUser = (userId: string) => {
    if (MOCK_USERS[userId]) {
      setCurrentUser(MOCK_USERS[userId]);
      localStorage.setItem("jsicp_current_user_id", userId);
    }
  };

  const switchRole = (role: UserRole) => {
    const found = Object.values(MOCK_USERS).find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem("jsicp_current_user_id", found.id);
    }
  };

  // 1. Submit Problem (Runs simulated AI classification, CV validation, dedup check, priority scoring, routing recommendations)
  const submitProblem = (newProb: Partial<Problem>): Problem => {
    const ticketId = `JSICP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Auto-detect if problem is health/medical related
    const textToCheck = `${newProb.title || ""} ${newProb.description || ""}`.toLowerCase();
    const isHealthDetected =
      newProb.category === "Healthcare & MedTech" ||
      textToCheck.includes("fever") ||
      textToCheck.includes("flew") ||
      textToCheck.includes("flu") ||
      textToCheck.includes("virus") ||
      textToCheck.includes("disease") ||
      textToCheck.includes("hospital");

    const category: any = isHealthDetected
      ? "Healthcare & MedTech"
      : newProb.category || "Water Resources & Sanitation";

    const aiRecs = getAiRoutingRecommendations(
      category,
      newProb.title || "",
      newProb.description || "",
      newProb.district || currentUser.district || "Ranchi"
    );

    const { nlpKeywords, cvSceneTags, validationLabel } = getDomainKeywordsAndTags(
      category,
      newProb.title || "",
      newProb.description || "",
      newProb.district || currentUser.district || "Ranchi",
      newProb.block
    );
    
    // Simulate AI pipeline
    const prob: Problem = {
      id: `prob-${Date.now()}`,
      ticketNumber: ticketId,
      submittedBy: currentUser.id,
      submitterName: currentUser.fullName,
      submitterRole: currentUser.role,
      title: newProb.title || "Untitled Civic Challenge",
      description: newProb.description || "",
      descriptionOriginalLang: newProb.descriptionOriginalLang || newProb.description || "",
      detectedLanguage: currentLanguage === "hi" ? "Hindi (hi)" : currentLanguage === "nagpuri" ? "Nagpuri (nag)" : "English (en)",
      category: category,
      subCategory: newProb.subCategory || "Community Scale Intervention",
      categoryConfidence: newProb.categoryConfidence !== undefined ? newProb.categoryConfidence : 0.96,
      priorityScore: newProb.priorityScore !== undefined ? newProb.priorityScore : Math.round((75 + Math.random() * 23) * 10) / 10,
      status: "pending_nodal_review",
      district: newProb.district || currentUser.district || "Ranchi",
      block: newProb.block || "Sadar Block",
      village: newProb.village || "Main Village",
      latitude: newProb.latitude || 23.3441,
      longitude: newProb.longitude || 85.3096,
      isDuplicateOf: null,
      citizenSupportCount: 1,
      sdgTags: newProb.sdgTags && newProb.sdgTags.length > 0 ? newProb.sdgTags : [
        category.includes("Health")
          ? "SDG 3: Good Health & Well-Being"
          : category.includes("Water")
          ? "SDG 6: Clean Water"
          : category.includes("Agri")
          ? "SDG 2: Zero Hunger"
          : "SDG 11: Sustainable Cities",
        "SDG 9: Innovation & Infrastructure"
      ],
      media: newProb.media && newProb.media.length > 0 ? newProb.media : [],
      aiExplanation: newProb.aiExplanation || {
        nlpKeywords,
        cvSceneTags,
        duplicateCheckResult: isHealthDetected
          ? "Zero duplicates in 5km radius. Priority public health outbreak alert routed to AIIMS Deoghar."
          : "Zero duplicates detected within 3km geo-radius.",
        priorityBreakdown: {
          severityWeight: isHealthDetected ? 38.0 : 35.0,
          affectedPopulationEstimate: 25.0,
          locationVulnerabilityIndex: 18.0,
          sdgImpactScore: 14.0
        },
        suggestedUniversities: aiRecs
      },
      source: newProb.source || "website",
      validationStatus: newProb.validationStatus || "valid",
      originalVoiceTranscription: newProb.originalVoiceTranscription,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

        setProblems((prev) => [prob, ...prev]);

    // Record on Blockchain Ledger
    addBlockchainBlock({
      eventType: "PROBLEM_SUBMISSION",
      entityId: prob.id,
      details: `Citizen ${prob.submitterName} registered challenge ${prob.ticketNumber} from ${prob.district} with priority score ${prob.priorityScore}.`,
      verifiedBy: "JSICP AI Gateway Node #1"
    });

    // Send multi-channel notification
    triggerNotification({
      userId: currentUser.id,
      channel: "whatsapp",
      eventType: "PROBLEM_SUBMITTED",
      title: "✅ Challenge Successfully Registered!",
      message: `Your challenge "${prob.title.slice(0, 45)}..." has been logged with ID ${prob.ticketNumber}. AI Engine priority: ${prob.priorityScore}/100.`,
      status: "delivered",
      linkUrl: "/my-problems"
    });

    return prob;
  };

  const upvoteProblem = (problemId: string) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === problemId) {
          return { ...p, citizenSupportCount: p.citizenSupportCount + 1 };
        }
        return p;
      })
    );
  };

  const updateProblemStatus = (
    problemId: string,
    newStatus: ProblemStatus,
    assignedUnivId?: string,
    assignedFacultyId?: string
  ) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === problemId) {
          const univ = assignedUnivId ? universities.find((u) => u.id === assignedUnivId) : null;
          return {
            ...p,
            status: newStatus,
            assignedUniversityId: assignedUnivId || p.assignedUniversityId,
            assignedUniversityName: univ ? univ.name : p.assignedUniversityName,
            assignedFacultyId: assignedFacultyId || p.assignedFacultyId,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      })
    );

    // If approved by Nodal Officer, log on blockchain
    if (newStatus === "routed" || newStatus === "accepted_by_hei") {
      addBlockchainBlock({
        eventType: "NODAL_APPROVAL",
        entityId: problemId,
        details: `Nodal review finalized. Status updated to ${newStatus}. Assigned to ${assignedUnivId || "HEI"}.`,
        verifiedBy: "State Nodal Officer Gateway"
      });
    }
  };

  const rateProblem = (problemId: string, rating: number, comment: string) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === problemId) {
          return { ...p, feedbackRating: rating, feedbackComment: comment, status: "closed" };
        }
        return p;
      })
    );
  };

  // 2. Universities & Team Building
  const createTeam = (newTeamData: Omit<Team, "id" | "createdAt">): Team => {
    const team: Team = {
      ...newTeamData,
      id: `team-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setTeams((prev) => [team, ...prev]);

    updateProblemStatus(newTeamData.problemId, "team_formed");

    triggerNotification({
      userId: currentUser.id,
      channel: "email",
      eventType: "TEAM_FORMED",
      title: "👥 Multidisciplinary Team Assembled",
      message: `Team formed under ${newTeamData.facultyMentorName} for problem "${newTeamData.problemTitle.slice(0, 40)}...". Ready for proposal drafting.`,
      status: "delivered",
      linkUrl: "/hei/teams"
    });

    return team;
  };

  const addTeamMember = (teamId: string, member: Omit<TeamMember, "id" | "teamId">) => {
    const newMember: TeamMember = {
      ...member,
      id: `mem-${Date.now()}`,
      teamId
    };
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, members: [...t.members, newMember] } : t))
    );
  };

  // 3. Proposals
  const createProposal = (proposalData: Omit<Proposal, "id" | "submittedAt">): Proposal => {
    const propStatus: Proposal["status"] = proposalData.needsIndustrySupport ? "open_for_funding" : "approved";
    const prop: Proposal = {
      ...proposalData,
      id: `prop-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: propStatus,
      approvedAt: !proposalData.needsIndustrySupport ? new Date().toISOString() : undefined,
      startupIncubationEligible: proposalData.estimatedBudget > 300000 || proposalData.needsIndustrySupport
    };

    setProposals((prev) => [prop, ...prev]);

    // Automatically create 5-stage milestones
    const newMilestones: Milestone[] = [
      {
        id: `ms-${Date.now()}-1`,
        proposalId: prop.id,
        index: 1,
        name: "research_design",
        displayName: "Milestone 1: Research, Chemical/Hardware Formulation & 3D CAD Design",
        description: "Background research, architectural design, component selection, and mathematical simulation modeling.",
        status: "in_progress",
        dueDate: "2026-03-30",
        facultyApproved: false,
        govtApproved: false,
        documents: []
      },
      {
        id: `ms-${Date.now()}-2`,
        proposalId: prop.id,
        index: 2,
        name: "prototype_build",
        displayName: "Milestone 2: Prototype Fabrication & Laboratory Bench Testing",
        description: "Bench assembly, embedded system fabrication, and lab sensor calibration.",
        status: "pending",
        dueDate: "2026-04-30",
        facultyApproved: false,
        govtApproved: false,
        documents: []
      },
      {
        id: `ms-${Date.now()}-3`,
        proposalId: prop.id,
        index: 3,
        name: "testing_validation",
        displayName: "Milestone 3: Field Testing & Pilot Calibration in District",
        description: "Deployment of beta unit at designated Jharkhand site with telemetry data collection.",
        status: "pending",
        dueDate: "2026-05-30",
        facultyApproved: false,
        govtApproved: false,
        documents: []
      },
      {
        id: `ms-${Date.now()}-4`,
        proposalId: prop.id,
        index: 4,
        name: "pilot_deployment",
        displayName: "Milestone 4: Community Pilot Deployment & User Training",
        description: "Handover to PRI/ULB community beneficiaries with operational user training.",
        status: "pending",
        dueDate: "2026-06-30",
        facultyApproved: false,
        govtApproved: false,
        documents: []
      },
      {
        id: `ms-${Date.now()}-5`,
        proposalId: prop.id,
        index: 5,
        name: "full_implementation",
        displayName: "Milestone 5: Impact Assessment, Patent Filing & Startup Incubation",
        description: "Final outcome audit, intellectual property patent application, and incubation scaling.",
        status: "pending",
        dueDate: "2026-07-30",
        facultyApproved: false,
        govtApproved: false,
        documents: []
      }
    ];

    setMilestones((prev) => [...newMilestones, ...prev]);

    // If direct academic research (no industry funding needed), immediately seed active sprint tasks & student deliverables
    if (!proposalData.needsIndustrySupport) {
      const task1: StudentDeliverableTask = {
        id: `dt-${Date.now()}-1`,
        proposalId: prop.id,
        proposalTitle: prop.title,
        milestoneId: newMilestones[0].id,
        milestoneName: newMilestones[0].displayName,
        title: `[${prop.title.slice(0, 32)}] Literature Review & 3D Schematics`,
        description: "Background research, mathematical modeling, and initial CAD drawings.",
        assignedStudentId: "student-rahul",
        assignedStudentName: "Rahul Kumar (Team Lead)",
        studentDiscipline: "Electronics & IoT Engineering",
        progressPercent: 20,
        status: "in_progress",
        assignedAt: new Date().toISOString()
      };
      const task2: StudentDeliverableTask = {
        id: `dt-${Date.now()}-2`,
        proposalId: prop.id,
        proposalTitle: prop.title,
        milestoneId: newMilestones[0].id,
        milestoneName: newMilestones[0].displayName,
        title: `[${prop.title.slice(0, 32)}] Firmware & IoT Telemetry Architecture`,
        description: "Set up ESP32 LoRaWAN gateway and cloud data ingestion pipeline.",
        assignedStudentId: "student-priya",
        assignedStudentName: "Priya Sharma (Student)",
        studentDiscipline: "Computer Science & Engineering",
        progressPercent: 10,
        status: "assigned",
        assignedAt: new Date().toISOString()
      };
      setStudentDeliverables((prev) => [task1, task2, ...prev]);

      const k1: KanbanTask = {
        id: `task-${Date.now()}-1`,
        teamId: "all",
        title: task1.title,
        description: task1.description,
        assignedTo: task1.assignedStudentId,
        assignedName: task1.assignedStudentName,
        status: "in_progress",
        priority: "high",
        milestoneName: "research_design",
        dueDate: "2026-03-30"
      };
      const k2: KanbanTask = {
        id: `task-${Date.now()}-2`,
        teamId: "all",
        title: task2.title,
        description: task2.description,
        assignedTo: task2.assignedStudentId,
        assignedName: task2.assignedStudentName,
        status: "backlog",
        priority: "medium",
        milestoneName: "research_design",
        dueDate: "2026-03-30"
      };
      setKanbanTasks((prev) => [k1, k2, ...prev]);
    }

    triggerNotification({
      userId: currentUser.id,
      channel: "email",
      eventType: "PROPOSAL_SUBMITTED",
      title: proposalData.needsIndustrySupport ? "🏢 Proposal Routed to Industry Marketplace" : "🎓 Academic Proposal Activated",
      message: proposalData.needsIndustrySupport
        ? `Proposal "${prop.title.slice(0, 40)}..." is listed for CSR co-funding. Student workspace unlocks upon MoU execution.`
        : `Proposal "${prop.title.slice(0, 40)}..." is approved for internal academic research. Student workspace unlocked!`,
      status: "delivered",
      linkUrl: proposalData.needsIndustrySupport ? "/industry/marketplace" : "/portal/student"
    });

    updateProblemStatus(prop.problemId, "in_progress");

    return prop;
  };

  const updateProposalStatus = (proposalId: string, status: Proposal["status"]) => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === proposalId) {
          return { ...p, status, approvedAt: status === "approved" ? new Date().toISOString() : p.approvedAt };
        }
        return p;
      })
    );
  };

  // 4. Industry Agreements
  const createAgreement = (agreementData: Omit<Agreement, "id" | "signedAt" | "blockchainTxHash">): Agreement => {
    const hash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
    const agreement: Agreement = {
      ...agreementData,
      id: `agr-${Date.now()}`,
      signedAt: new Date().toISOString(),
      blockchainTxHash: hash,
      status: "active"
    };

    setAgreements((prev) => [agreement, ...prev]);

    // Update proposal to funded with partner details
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === agreementData.proposalId) {
          return {
            ...p,
            status: "funded",
            industryPartnerId: agreementData.industryPartnerId,
            industryPartnerName: agreementData.industryPartnerName,
            approvedAt: new Date().toISOString()
          };
        }
        return p;
      })
    );

    // Progress corresponding problem into active execution phase (industry_matched / in_progress)
    const targetProp = proposals.find((p) => p.id === agreementData.proposalId);
    if (targetProp && targetProp.problemId) {
      updateProblemStatus(targetProp.problemId, "in_progress");
    }

    // Auto-generate active sprint tasks for the student team on this funded project!
    const propTitle = agreementData.proposalTitle || "Active Innovation Project";
    const newSprintTasks: KanbanTask[] = [
      {
        id: `task-${Date.now()}-1`,
        teamId: "all",
        title: `[${propTitle.slice(0, 32)}] Laboratory Fabrication & Sensor Assembly`,
        description: `Fabricate prototype hardware using committed ₹${agreementData.amount.toLocaleString("en-IN")} CSR grant from ${agreementData.industryPartnerName}.`,
        assignedTo: "student-rahul",
        assignedName: "Rahul Kumar (Lead)",
        status: "in_progress",
        priority: "high",
        milestoneName: "prototype_build",
        dueDate: "2026-04-15"
      },
      {
        id: `task-${Date.now()}-2`,
        teamId: "all",
        title: `[${propTitle.slice(0, 32)}] Continuous Telemetry & NABL Lab Stress Testing`,
        description: `Execute 14-day continuous stress tests and log telemetry data in Document Vault for Faculty verification.`,
        assignedTo: "student-sneha",
        assignedName: "Sneha Soren",
        status: "review",
        priority: "high",
        milestoneName: "testing_validation",
        dueDate: "2026-05-10"
      },
      {
        id: `task-${Date.now()}-3`,
        teamId: "all",
        title: `[${propTitle.slice(0, 32)}] Field Trial Deployment & Pilot Foundation`,
        description: `Install beta unit at designated community site and prepare for Faculty & Govt Dual Sign-off.`,
        assignedTo: "student-priya",
        assignedName: "Priya Sharma",
        status: "backlog",
        priority: "medium",
        milestoneName: "pilot_deployment",
        dueDate: "2026-06-05"
      }
    ];

    setKanbanTasks((prev) => [...newSprintTasks, ...prev]);

    // Blockchain block
    addBlockchainBlock({
      eventType: "MOU_SIGNED",
      entityId: agreement.id,
      details: `${agreement.industryPartnerName} signed ${agreement.agreementType.toUpperCase()} Agreement for "${agreement.proposalTitle.slice(0, 35)}..." amounting to INR ${(agreement.amount).toLocaleString("en-IN")}.`,
      verifiedBy: "Jharkhand Innovation Smart Contract Oracle"
    });

    triggerNotification({
      userId: currentUser.id,
      channel: "whatsapp",
      eventType: "MOU_SIGNED",
      title: "🎉 MoU Successfully Executed & Stamped!",
      message: `${agreement.industryPartnerName} has officially partnered with ${agreement.universityName}. Funds committed: ₹${(agreement.amount).toLocaleString("en-IN")}.`,
      status: "delivered",
      linkUrl: "/industry/agreements"
    });

    return agreement;
  };

  // 5. Milestone & Document Vault Management
  const updateMilestoneStatus = (milestoneId: string, status: MilestoneStatus) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === milestoneId) {
          return {
            ...m,
            status,
            completedAt: status === "approved" ? new Date().toISOString() : m.completedAt
          };
        }
        return m;
      })
    );
  };

  const approveMilestoneFaculty = (milestoneId: string, approverName: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === milestoneId) {
          const bothApproved = m.govtApproved;
          return {
            ...m,
            facultyApproved: true,
            facultyApprovedBy: approverName,
            status: bothApproved ? "approved" : "submitted"
          };
        }
        return m;
      })
    );
  };

  const approveMilestoneGovt = (milestoneId: string, approverName: string) => {
    let affectedProposalId = "";
    let isFinalOrPilot = false;

    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === milestoneId) {
          affectedProposalId = m.proposalId;
          if (m.index >= 4 || m.name === "pilot_deployment" || m.name === "full_implementation") {
            isFinalOrPilot = true;
          }

          const bothApproved = m.facultyApproved || true; // Dual sign-off satisfied with govt authorization
          const updatedStatus = "approved";

          addBlockchainBlock({
            eventType: "MILESTONE_APPROVED",
            entityId: milestoneId,
            details: `Dual Sign-off stamped by Govt Officer ${approverName} for ${m.displayName}. Tranche release authorized on smart contract.`,
            verifiedBy: "Government District Oracle"
          });

          return {
            ...m,
            govtApproved: true,
            govtApprovedBy: approverName,
            status: updatedStatus,
            completedAt: new Date().toISOString()
          };
        }
        return m;
      })
    );

    // If pilot or full implementation milestone is stamped, advance problem to deployed!
    const targetProp = proposals.find((p) => p.id === affectedProposalId);
    if (targetProp && targetProp.problemId) {
      updateProblemStatus(targetProp.problemId, "deployed");

      triggerNotification({
        userId: currentUser.id,
        channel: "whatsapp",
        eventType: "PROBLEM_DEPLOYED",
        title: "🎉 Community Solution Deployed & Verified!",
        message: `Field trials for "${targetProp.problemTitle}" have been stamped by the District Magistrate. Solution is now deployed on-ground!`,
        status: "delivered",
        linkUrl: "/portal/citizen"
      });
    }
  };

  const advanceProblemToDeployed = (problemId: string) => {
    updateProblemStatus(problemId, "deployed");
    // Also approve milestones for that problem
    const targetProp = proposals.find((p) => p.problemId === problemId);
    if (targetProp) {
      setMilestones((prev) =>
        prev.map((m) =>
          m.proposalId === targetProp.id
            ? { ...m, facultyApproved: true, govtApproved: true, status: "approved", completedAt: new Date().toISOString() }
            : m
        )
      );
    }
    triggerNotification({
      userId: currentUser.id,
      channel: "whatsapp",
      eventType: "PROBLEM_DEPLOYED",
      title: "🎉 Community Solution Deployed & Verified!",
      message: `The engineering solution has been successfully installed in the field. Please submit your 5-Star Citizen Rating!`,
      status: "delivered",
      linkUrl: "/portal/citizen"
    });
  };

  const uploadMilestoneDocument = (milestoneId: string, docData: Omit<DocumentVaultItem, "id" | "uploadedAt">) => {
    const newDoc: DocumentVaultItem = {
      ...docData,
      id: `doc-${Date.now()}`,
      milestoneId,
      uploadedAt: new Date().toISOString()
    };

    setMilestones((prev) =>
      prev.map((m) => (m.id === milestoneId ? { ...m, documents: [...m.documents, newDoc] } : m))
    );
  };

  // 6. Kanban Tasks
  const updateTaskStatus = (taskId: string, newStatus: KanbanTask["status"]) => {
    setKanbanTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const createTask = (taskData: Omit<KanbanTask, "id">) => {
    const newTask: KanbanTask = {
      ...taskData,
      id: `task-${Date.now()}`
    };
    setKanbanTasks((prev) => [newTask, ...prev]);
  };

  // 7. Notifications
  const markNotificationAsRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, status: "read" } : n))
    );
  };

  const triggerNotification = (notifData: Omit<NotificationItem, "id" | "sentAt">) => {
    const notif: NotificationItem = {
      ...notifData,
      id: `notif-${Date.now()}`,
      sentAt: new Date().toISOString()
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // 8. Blockchain Ledger
  const addBlockchainBlock = (
    blockData: Omit<BlockchainLedgerBlock, "blockNumber" | "timestamp" | "previousHash" | "currentHash">
  ) => {
    setBlockchainLedger((prev) => {
      const lastBlock = prev[prev.length - 1];
      const prevHash = lastBlock ? lastBlock.currentHash : "0x0000000000000000000000000000000000000000000000000000000000000000";
      const newHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
      const block: BlockchainLedgerBlock = {
        ...blockData,
        blockNumber: prev.length + 1,
        timestamp: new Date().toISOString(),
        previousHash: prevHash,
        currentHash: newHash
      };
      return [...prev, block];
    });
  };

  // 9. Offline Sync
  const syncOfflineQueue = () => {
    if (offlineQueue.length === 0) return;
    offlineQueue.forEach((item) => {
      submitProblem(item);
    });
    setOfflineQueue([]);
  };

  const assignStudentTask = (taskData: Omit<StudentDeliverableTask, "id">) => {
    const newTask: StudentDeliverableTask = {
      ...taskData,
      id: `dt-${Date.now()}`
    };
    setStudentDeliverables((prev) => [newTask, ...prev]);

    // Also mirror into kanban tasks
    createTask({
      teamId: "all",
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedStudentId,
      assignedName: newTask.assignedStudentName,
      status: "in_progress",
      priority: "high",
      milestoneName: "prototype_build",
      dueDate: "2026-04-30"
    });
  };

  const submitStudentDeliverable = (taskId: string, progressPercent: number, notes: string, pdfUrl?: string) => {
    let taskName = "";
    setStudentDeliverables((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          taskName = t.title;
          const isComplete = progressPercent >= 100;
          return {
            ...t,
            progressPercent,
            submissionNotes: notes,
            pdfUrl: pdfUrl || t.pdfUrl || `/vault/${t.title.toLowerCase().replace(/ /g, "_")}.pdf`,
            status: isComplete ? "in_review_by_faculty" : "in_progress",
            submittedAt: isComplete ? new Date().toISOString() : t.submittedAt
          };
        }
        return t;
      })
    );

    triggerNotification({
      userId: "faculty-ananya",
      channel: "email",
      eventType: "DELIVERABLE_SUBMITTED",
      title: "📑 Student Deliverable Submitted for Inspection",
      message: `Deliverable  has been submitted with progress ${progressPercent}% and attached laboratory report. Ready for faculty review.`,
      status: "delivered",
      linkUrl: "/portal/faculty"
    });
  };

  const reviewStudentDeliverable = (taskId: string, decision: "accept" | "reject", feedback: string, approverName: string) => {
    let targetMilestoneId = "";
    setStudentDeliverables((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          targetMilestoneId = t.milestoneId;
          if (decision === "accept") {
            return {
              ...t,
              status: "approved_by_faculty",
              progressPercent: 100,
              facultyFeedback: feedback,
              facultySignedAt: new Date().toISOString(),
              facultySignedBy: approverName
            };
          } else {
            return {
              ...t,
              status: "revision_requested",
              facultyFeedback: feedback
            };
          }
        }
        return t;
      })
    );

    if (decision === "accept" && targetMilestoneId) {
      approveMilestoneFaculty(targetMilestoneId, approverName);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers: MOCK_USERS,
        switchUser,
        switchRole,
        problems,
        submitProblem,
        upvoteProblem,
        updateProblemStatus,
        rateProblem,
        advanceProblemToDeployed,
        universities,
        teams,
        createTeam,
        addTeamMember,
        proposals,
        createProposal,
        updateProposalStatus,
        agreements,
        createAgreement,
        milestones,
        updateMilestoneStatus,
        approveMilestoneFaculty,
        approveMilestoneGovt,
        uploadMilestoneDocument,
        studentDeliverables,
        assignStudentTask,
        submitStudentDeliverable,
        reviewStudentDeliverable,
        kanbanTasks,
        updateTaskStatus,
        createTask,
        notifications,
        markNotificationAsRead,
        triggerNotification,
        blockchainLedger,
        addBlockchainBlock,
        districts,
        selectedDistrict,
        setSelectedDistrict,
        currentLanguage,
        setCurrentLanguage,
        isOnline,
        offlineQueue,
        syncOfflineQueue,
        inspectingProblem,
        setInspectingProblem,
        chatbotOpen,
        setChatbotOpen,
        whatsappSimulatorOpen,
        setWhatsappSimulatorOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
