export interface EcosystemStudent {
  id: string;
  fullName: string;
  roleKey: string;
  role: string;
  discipline: string;
  yearOfStudy: string;
  email: string;
}

export interface UniversityEcosystem {
  id: string;
  name: string;
  shortName: string;
  district: string;
  domainName: string;
  domainIcon: string;
  nodal: {
    id: string;
    fullName: string;
    roleKey: string;
    email: string;
    title: string;
  };
  faculty: {
    id: string;
    fullName: string;
    roleKey: string;
    email: string;
    dept: string;
    title: string;
    specialization: string;
  };
  students: EcosystemStudent[];
  defaultProblemId: string;
  defaultTeamId: string;
  defaultProposalId: string;
}

export const UNIVERSITY_ECOSYSTEMS: Record<string, UniversityEcosystem> = {
  "univ-bit-mesra": {
    id: "univ-bit-mesra",
    name: "Birla Institute of Technology, Mesra",
    shortName: "BIT Mesra, Ranchi",
    district: "Ranchi",
    domainName: "Water Resources & Environmental Engg",
    domainIcon: "💧",
    nodal: {
      id: "user-nodal-bit",
      fullName: "Dr. Rajesh Verma",
      roleKey: "hei_nodal",
      email: "nodal.innovation@bitmesra.ac.in",
      title: "University Nodal Officer (HEI Desk)"
    },
    faculty: {
      id: "faculty-ananya",
      fullName: "Prof. Ananya Sen",
      roleKey: "faculty",
      email: "ananya.sen@bitmesra.ac.in",
      dept: "Dept of Water & Environmental Engineering",
      title: "Associate Professor & Research Mentor",
      specialization: "Nano-adsorptive water purification & IoT water quality telemetry"
    },
    students: [
      {
        id: "student-rahul",
        fullName: "Rahul Kumar",
        roleKey: "student",
        role: "Team Lead",
        discipline: "Electronics & IoT Engineering",
        yearOfStudy: "3rd Year B.Tech",
        email: "rahul.iot@bitmesra.ac.in"
      },
      {
        id: "student-priya",
        fullName: "Priya Sharma",
        roleKey: "student_priya",
        role: "Hardware Lead",
        discipline: "Chemical & Membrane Tech",
        yearOfStudy: "4th Year B.Tech",
        email: "priya.chem@bitmesra.ac.in"
      },
      {
        id: "student-sneha",
        fullName: "Sneha Soren",
        roleKey: "student_sneha",
        role: "Field Researcher",
        discipline: "Rural Development & Social Work",
        yearOfStudy: "2nd Year M.Tech",
        email: "sneha.rural@bitmesra.ac.in"
      },
      {
        id: "student-amit",
        fullName: "Amit Verma",
        roleKey: "student_amit",
        role: "Software Lead",
        discipline: "Mechanical Engineering",
        yearOfStudy: "3rd Year B.Tech",
        email: "amit.mech@bitmesra.ac.in"
      }
    ],
    defaultProblemId: "prob-001",
    defaultTeamId: "team-001",
    defaultProposalId: "prop-001"
  },
  "univ-iit-dhanbad": {
    id: "univ-iit-dhanbad",
    name: "Indian Institute of Technology (ISM) Dhanbad",
    shortName: "IIT (ISM) Dhanbad",
    district: "Dhanbad",
    domainName: "Mining Remediation & Geo-Robotics",
    domainIcon: "⛏️",
    nodal: {
      id: "user-nodal-iit",
      fullName: "Prof. S. K. Roy",
      roleKey: "hei_iit_dhanbad",
      email: "nodal.rnd@iitism.ac.in",
      title: "Nodal Officer (IIT ISM Dhanbad)"
    },
    faculty: {
      id: "faculty-iit-arvind",
      fullName: "Prof. Arvind Mukhopadhyay",
      roleKey: "faculty_iit",
      email: "arvind.mining@iitism.ac.in",
      dept: "Dept of Mining Engineering & Robotics",
      title: "Professor of Mining Machinery & Robotics",
      specialization: "Autonomous Mining Drones, Geo-thermal Capping & Underground LoRa Mesh"
    },
    students: [
      {
        id: "student-iit-rohan",
        fullName: "Rohan Deshmukh",
        roleKey: "student_iit_rohan",
        role: "Team Lead",
        discipline: "Mining Machinery & Robotics",
        yearOfStudy: "3rd Year B.Tech",
        email: "rohan.mining@iitism.ac.in"
      },
      {
        id: "student-iit-ananya",
        fullName: "Ananya Sengupta",
        roleKey: "student_iit_ananya",
        role: "Hardware Lead",
        discipline: "Applied Geophysics & AI",
        yearOfStudy: "4th Year B.Tech",
        email: "ananya.geo@iitism.ac.in"
      },
      {
        id: "student-iit-vikas",
        fullName: "Vikas Mahto",
        roleKey: "student_iit_vikas",
        role: "Software Lead",
        discipline: "Computer Science & Mining Systems",
        yearOfStudy: "3rd Year B.Tech",
        email: "vikas.mining@iitism.ac.in"
      }
    ],
    defaultProblemId: "prob-003",
    defaultTeamId: "team-002",
    defaultProposalId: "prop-003"
  },
  "univ-aiims-deoghar": {
    id: "univ-aiims-deoghar",
    name: "All India Institute of Medical Sciences, Deoghar",
    shortName: "AIIMS Deoghar",
    district: "Deoghar",
    domainName: "Healthcare & MedTech Telemetry",
    domainIcon: "🏥",
    nodal: {
      id: "user-nodal-aiims",
      fullName: "Dr. A. K. Mishra",
      roleKey: "hei_aiims_deoghar",
      email: "nodal.rnd@aiimsdeoghar.edu.in",
      title: "Nodal Officer (AIIMS Deoghar)"
    },
    faculty: {
      id: "faculty-aiims-rajesh",
      fullName: "Dr. Rajesh Soren",
      roleKey: "faculty_aiims",
      email: "rajesh.soren@aiimsdeoghar.edu.in",
      dept: "Centre for Community Medicine & MedTech Devices",
      title: "Associate Professor & MedTech Lab Director",
      specialization: "Cold-Chain Logistics, Vaccine Telemetry & Rural Public Health Devices"
    },
    students: [
      {
        id: "student-aiims-deepak",
        fullName: "Dr. Deepak Soren",
        roleKey: "student_aiims_deepak",
        role: "Team Lead",
        discipline: "Centre for Community Medicine & MedTech Devices",
        yearOfStudy: "Senior Resident",
        email: "deepak.soren@aiimsdeoghar.edu.in"
      },
      {
        id: "student-aiims-kavita",
        fullName: "Kavita Tirkey",
        roleKey: "student_aiims_kavita",
        role: "Hardware Lead",
        discipline: "Biomedical Engineering & Tele-Health",
        yearOfStudy: "3rd Year B.Tech",
        email: "kavita.biomed@aiimsdeoghar.edu.in"
      }
    ],
    defaultProblemId: "prob-004",
    defaultTeamId: "team-004",
    defaultProposalId: "prop-004"
  },
  "univ-bau-kanke": {
    id: "univ-bau-kanke",
    name: "Birsa Agricultural University, Kanke",
    shortName: "BAU Ranchi",
    district: "Ranchi",
    domainName: "Agriculture & Tribal Bio-Processing",
    domainIcon: "🌾",
    nodal: {
      id: "user-nodal-bau",
      fullName: "Dr. Manoj Tiwary",
      roleKey: "hei_bau_ranchi",
      email: "nodal.rnd@bauranchi.org",
      title: "Nodal Officer (BAU Ranchi)"
    },
    faculty: {
      id: "faculty-bau-sunita",
      fullName: "Dr. Sunita Murmu",
      roleKey: "faculty_bau",
      email: "sunita.murmu@bauranchi.org",
      dept: "Dept of Agronomy & Farm Mechanization",
      title: "Associate Professor of Agronomy & Farm Tech",
      specialization: "Tribal Agri-Mechanization, Solar Post-Harvest Processing & Soil IoT"
    },
    students: [
      {
        id: "student-bau-birsa",
        fullName: "Birsa Oraon",
        roleKey: "student_bau_birsa",
        role: "Team Lead",
        discipline: "Agricultural Engineering & Soil Sensors",
        yearOfStudy: "3rd Year B.Tech",
        email: "birsa.agri@bauranchi.org"
      },
      {
        id: "student-bau-pooja",
        fullName: "Pooja Kumari",
        roleKey: "student_bau_pooja",
        role: "Field Researcher",
        discipline: "Centre for Bio-Inoculants & Post-Harvest Tech",
        yearOfStudy: "4th Year B.Tech",
        email: "pooja.biotech@bauranchi.org"
      }
    ],
    defaultProblemId: "prob-002",
    defaultTeamId: "team-003",
    defaultProposalId: "prop-002"
  }
};

export const getEcosystemByUserId = (
  userId?: string,
  orgName?: string,
  univId?: string
): UniversityEcosystem => {
  if (univId && UNIVERSITY_ECOSYSTEMS[univId]) {
    return UNIVERSITY_ECOSYSTEMS[univId];
  }

  const text = (String(userId || "") + " " + String(orgName || "")).toLowerCase();

  if (text.includes("iit") || text.includes("dhanbad") || text.includes("mining") || text.includes("arvind") || text.includes("rohan") || text.includes("deshmukh")) {
    return UNIVERSITY_ECOSYSTEMS["univ-iit-dhanbad"];
  }
  if (text.includes("aiims") || text.includes("deoghar") || text.includes("medtech") || text.includes("deepak") || text.includes("kavita") || (text.includes("soren") && text.includes("rajesh"))) {
    return UNIVERSITY_ECOSYSTEMS["univ-aiims-deoghar"];
  }
  if (text.includes("bau") || text.includes("birsa agricultural") || text.includes("kanke") || text.includes("murmu") || text.includes("pooja") || (text.includes("oraon") && text.includes("birsa"))) {
    return UNIVERSITY_ECOSYSTEMS["univ-bau-kanke"];
  }

  return UNIVERSITY_ECOSYSTEMS["univ-bit-mesra"];
};

export interface SuggestedUniversityMatch {
  universityId: string;
  universityName: string;
  score: number;
  rank: number;
  reason: string;
}

/**
 * Intelligent domain and keyword-aware AI routing engine for Jharkhand HEIs.
 * Maps health/viral/epidemic challenges to AIIMS Deoghar, mining/fire to IIT ISM,
 * agri/forest/tribal to BAU Ranchi, and water/infra/solar to BIT Mesra / NIT.
 */
export const getAiRoutingRecommendations = (
  category: string = "Healthcare & MedTech",
  title: string = "",
  description: string = "",
  district: string = "Ranchi"
): SuggestedUniversityMatch[] => {
  const text = (String(title || "") + " " + String(description || "") + " " + String(category || "")).toLowerCase();

  // 1. Healthcare & MedTech / Medical / Disease / Fever / Viral / PHC / Epidemic
  if (
    category === "Healthcare & MedTech" ||
    text.includes("fever") ||
    text.includes("flew") ||
    text.includes("flu") ||
    text.includes("virus") ||
    text.includes("viral") ||
    text.includes("epidemic") ||
    text.includes("disease") ||
    text.includes("vaccine") ||
    text.includes("health") ||
    text.includes("doctor") ||
    text.includes("patient") ||
    text.includes("medical") ||
    text.includes("silicosis")
  ) {
    return [
      {
        universityId: "univ-aiims-deoghar",
        universityName: "AIIMS Deoghar",
        score: 0.98,
        rank: 1,
        reason: `Apex Medical Institute in Jharkhand with Advanced Virology, Epidemic Response, Public Health & MedTech Research Labs (handling ${district} region)`
      },
      {
        universityId: "univ-bit-mesra",
        universityName: "BIT Mesra, Ranchi",
        score: 0.86,
        rank: 2,
        reason: "Bio-Medical Instrumentation, Sensors & Tele-Health Embedded Systems Lab"
      },
      {
        universityId: "univ-ranchi-univ",
        universityName: "Ranchi University",
        score: 0.76,
        rank: 3,
        reason: "Community Medicine & Public Health Epidemiology Survey Department"
      }
    ];
  }

  // 2. Environment & Mining Remediation / Coal / Seam / Fire / Blast / Methane / Mine / Geology
  if (
    category === "Environment & Mining Remediation" ||
    text.includes("mining") ||
    text.includes("coal") ||
    text.includes("methane") ||
    text.includes("fire") ||
    text.includes("subsidence") ||
    text.includes("tailing") ||
    text.includes("leachate") ||
    text.includes("acid mine") ||
    text.includes("quarry")
  ) {
    return [
      {
        universityId: "univ-iit-dhanbad",
        universityName: "IIT (ISM) Dhanbad",
        score: 0.99,
        rank: 1,
        reason: "World-class Mining Engg, Geo-thermal Capping & Mine Safety Research Centres located in Dhanbad"
      },
      {
        universityId: "univ-nit-jamshedpur",
        universityName: "NIT Jamshedpur",
        score: 0.83,
        rank: 2,
        reason: "Civil & Geotechnical Remediation Laboratory"
      },
      {
        universityId: "univ-bit-mesra",
        universityName: "BIT Mesra, Ranchi",
        score: 0.77,
        rank: 3,
        reason: "Environmental Science & Remote Sensing Cell"
      }
    ];
  }

  // 3. Agriculture & Allied Technologies OR Forest & Tribal Livelihoods
  if (
    category === "Agriculture & Allied Technologies" ||
    category === "Forest & Tribal Livelihoods" ||
    text.includes("agriculture") ||
    text.includes("agri") ||
    text.includes("crop") ||
    text.includes("lac") ||
    text.includes("farmer") ||
    text.includes("soil") ||
    text.includes("paddy") ||
    text.includes("drought") ||
    text.includes("millet") ||
    text.includes("harvest") ||
    text.includes("tribal produce")
  ) {
    return [
      {
        universityId: "univ-bau-kanke",
        universityName: "BAU Ranchi",
        score: 0.98,
        rank: 1,
        reason: `Premier State Agricultural University with Agronomy, Bio-processing & Dryland Farming Research Labs in ${district}`
      },
      {
        universityId: "univ-bit-mesra",
        universityName: "BIT Mesra, Ranchi",
        score: 0.84,
        rank: 2,
        reason: "Mechanical Solar Food Processing & Farm IoT Automation Lab"
      },
      {
        universityId: "univ-ranchi-univ",
        universityName: "Ranchi University",
        score: 0.74,
        rank: 3,
        reason: "Tribal Studies & Rural Economy Value-Chain Cell"
      }
    ];
  }

  // 4. Rural Infrastructure & Transport
  if (
    category === "Rural Infrastructure & Transport" ||
    text.includes("road") ||
    text.includes("bridge") ||
    text.includes("transport") ||
    text.includes("river") ||
    text.includes("flood") ||
    text.includes("embankment")
  ) {
    return [
      {
        universityId: "univ-nit-jamshedpur",
        universityName: "NIT Jamshedpur",
        score: 0.95,
        rank: 1,
        reason: `Apex Civil Engineering, River Basin Telemetry & Structural Testing Laboratory (Proximity to ${district})`
      },
      {
        universityId: "univ-bit-mesra",
        universityName: "BIT Mesra, Ranchi",
        score: 0.88,
        rank: 2,
        reason: "Hydraulic Simulation & IoT Early Warning Sensor Network"
      },
      {
        universityId: "univ-iit-dhanbad",
        universityName: "IIT (ISM) Dhanbad",
        score: 0.80,
        rank: 3,
        reason: "Rock Mechanics & Geotechnical Infrastructure Analysis"
      }
    ];
  }

  // 5. Default: Water Resources & Sanitation / Renewable Energy & Off-Grid Power
  return [
    {
      universityId: "univ-bit-mesra",
      universityName: "BIT Mesra, Ranchi",
      score: 0.96,
      rank: 1,
      reason: `Direct domain expertise in Water Resources & Environmental Engg + Active Water Quality Testing Lab in ${district}`
    },
    {
      universityId: "univ-iit-dhanbad",
      universityName: "IIT (ISM) Dhanbad",
      score: 0.88,
      rank: 2,
      reason: "High expertise in Hydro-geological Filtration & Groundwater Membrane Tech"
    },
    {
      universityId: "univ-bau-kanke",
      universityName: "BAU Ranchi",
      score: 0.75,
      rank: 3,
      reason: "Agricultural Runoff & Groundwater Soil Contamination Department"
    }
  ];
};

export interface DomainVerificationDetails {
  nlpKeywords: string[];
  cvSceneTags: string[];
  validationLabel: string;
}

export const getDomainKeywordsAndTags = (
  category: string = "Water Resources & Sanitation",
  title: string = "",
  description: string = "",
  district: string = "Ranchi",
  block?: string
): DomainVerificationDetails => {
  const combined = `${title} ${description} ${category}`.toLowerCase();
  const locTag = (block || district || "Ranchi").toLowerCase().replace(/[^a-z0-9]/g, "_");

  // 1. Water Resources & Sanitation
  if (
    category === "Water Resources & Sanitation" ||
    combined.includes("water") ||
    combined.includes("pani") ||
    combined.includes("handpump") ||
    combined.includes("jal") ||
    combined.includes("shortage") ||
    combined.includes("borewell") ||
    combined.includes("fluoride") ||
    combined.includes("arsenic") ||
    combined.includes("tap") ||
    combined.includes("pipeline")
  ) {
    const isContaminated =
      combined.includes("fluoride") ||
      combined.includes("arsenic") ||
      combined.includes("dirty") ||
      combined.includes("ganda") ||
      combined.includes("contamination");
    return {
      nlpKeywords: [
        isContaminated ? "water_contamination" : "water_scarcity",
        "drinking_water",
        "community_supply",
        "borewell_handpump",
        locTag
      ],
      cvSceneTags: [
        "water source verified",
        isContaminated ? "turbidity & contamination detected" : "potable water shortage verified",
        "ground supply anomaly"
      ],
      validationLabel: "Verified Water Resources & Supply Issue"
    };
  }

  // 2. Healthcare & MedTech
  if (
    category === "Healthcare & MedTech" ||
    combined.includes("fever") ||
    combined.includes("disease") ||
    combined.includes("flu") ||
    combined.includes("virus") ||
    combined.includes("hospital") ||
    combined.includes("doctor") ||
    combined.includes("bimar") ||
    combined.includes("weakness") ||
    combined.includes("kamzori") ||
    combined.includes("kuposhan") ||
    combined.includes("malnutrition") ||
    combined.includes("ilaj") ||
    combined.includes("dawa") ||
    combined.includes("health")
  ) {
    const kws = ["public_health", "medical_facility", "primary_health_centre", "clinical_demand", locTag];
    if (combined.includes("weakness") || combined.includes("kamzori") || combined.includes("kuposhan") || combined.includes("malnutrition")) {
      kws[1] = "community_weakness_alert";
      kws[3] = "nutrition_vitality_deficit";
    } else if (combined.includes("fever") || combined.includes("bukhar") || combined.includes("virus")) {
      kws[1] = "fever_epidemic_alert";
    }
    return {
      nlpKeywords: kws,
      cvSceneTags: ["clinical symptom pattern verified", "community health demand", "medical facility deficit"],
      validationLabel: "Verified Public Health & Clinical Challenge"
    };
  }

  // 3. Rural Infrastructure & Transport
  if (
    category === "Rural Infrastructure & Transport" ||
    combined.includes("road") ||
    combined.includes("sadak") ||
    combined.includes("bridge") ||
    combined.includes("pul") ||
    combined.includes("pothole") ||
    combined.includes("khadde") ||
    combined.includes("khadda") ||
    combined.includes("gaddha") ||
    combined.includes("transport")
  ) {
    const kws = ["rural_road", "potholes_damage", "culvert_bridge", "connectivity_issue", locTag];
    if (combined.includes("khadde") || combined.includes("khadda")) {
      kws[1] = "road_khadde_potholes";
    }
    return {
      nlpKeywords: kws,
      cvSceneTags: ["road surface erosion verified", "pothole / culvert defect", "transit hazard detected"],
      validationLabel: "Verified Rural Infrastructure & Transport Defect"
    };
  }

  // 4. Agriculture & Allied Technologies
  if (
    category === "Agriculture & Allied Technologies" ||
    combined.includes("crop") ||
    combined.includes("fasal") ||
    combined.includes("kisan") ||
    combined.includes("irrigation") ||
    combined.includes("soil") ||
    combined.includes("drought")
  ) {
    return {
      nlpKeywords: ["crop_health", "irrigation_need", "soil_fertility", "farmer_livelihood", locTag],
      cvSceneTags: ["crop stress verified", "irrigation system anomaly", "agricultural impact identified"],
      validationLabel: "Verified Agricultural & Irrigation Challenge"
    };
  }

  // 5. Renewable Energy & Off-Grid Power
  if (
    category === "Renewable Energy & Off-Grid Power" ||
    combined.includes("solar") ||
    combined.includes("power") ||
    combined.includes("bijli") ||
    combined.includes("electric") ||
    combined.includes("transformer")
  ) {
    return {
      nlpKeywords: ["power_outage", "solar_microgrid", "transformer_fault", "electricity_supply", locTag],
      cvSceneTags: ["electrical line / transformer anomaly", "solar generation deficit", "power supply disrupted"],
      validationLabel: "Verified Renewable Energy & Power Supply Issue"
    };
  }

  // 6. Education & Smart Learning
  if (
    category === "Education & Smart Learning" ||
    combined.includes("school") ||
    combined.includes("student") ||
    combined.includes("teacher") ||
    combined.includes("padhai") ||
    combined.includes("classroom")
  ) {
    return {
      nlpKeywords: ["school_facility", "digital_classroom", "student_welfare", "teacher_shortage", locTag],
      cvSceneTags: ["classroom infrastructure need", "school learning facility defect", "educational resource deficit"],
      validationLabel: "Verified Education & School Facility Issue"
    };
  }

  // 7. Environment & Mining Remediation
  if (
    category === "Environment & Mining Remediation" ||
    combined.includes("mining") ||
    combined.includes("coal") ||
    combined.includes("koyla") ||
    combined.includes("subsidence") ||
    combined.includes("methane") ||
    combined.includes("pollution")
  ) {
    return {
      nlpKeywords: ["coal_seam_fire", "mining_subsidence", "methane_hazard", "environmental_remediation", locTag],
      cvSceneTags: ["ground fissure / subsidence verified", "smoke & dust emission pattern", "mining zone hazard"],
      validationLabel: "Verified Environmental & Mining Hazard"
    };
  }

  // 8. Forest & Tribal Livelihoods
  if (
    category === "Forest & Tribal Livelihoods" ||
    combined.includes("tribal") ||
    combined.includes("forest") ||
    combined.includes("jungle") ||
    combined.includes("lac") ||
    combined.includes("mahua") ||
    combined.includes("artisan")
  ) {
    return {
      nlpKeywords: ["tribal_livelihood", "minor_forest_produce", "lac_processing", "mahua_storage", locTag],
      cvSceneTags: ["forest produce cluster verified", "tribal artisan processing unit", "rural forest livelihood support"],
      validationLabel: "Verified Tribal Livelihood & Forest Produce Challenge"
    };
  }

  // Default fallback
  return {
    nlpKeywords: ["civic_challenge", "community_welfare", "public_service", "local_development", locTag],
    cvSceneTags: ["civic issue verified", "community impact verified", "field report authenticated"],
    validationLabel: "Verified Civic Challenge"
  };
};
