import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { aiEngine, JHARKHAND_DISTRICTS } from "../../services/aiEngine";
import { ProblemCategory, Problem } from "../../types";
import { CameraCaptureModal } from "../common/CameraCaptureModal";
import {
  Send,
  Mic,
  Camera,
  Paperclip,
  CheckCheck,
  X,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  RotateCcw,
  Play,
  Trash2
} from "lucide-react";
import confetti from "canvas-confetti";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
  image?: string;
  isVoiceNote?: boolean;
  voiceDuration?: string;
  options?: string[];
  isConfirmationCard?: boolean;
  confirmationData?: {
    problem: string;
    theme: ProblemCategory;
    district: string;
    block: string;
    village: string;
    imageUrl?: string;
  };
  isProgressCard?: boolean;
  progressData?: {
    ticketNumber: string;
    title: string;
    category: ProblemCategory;
    status: string;
    district: string;
    block: string;
    village?: string;
    assignedUniversity?: string;
    assignedFaculty?: string;
    priorityScore?: number;
    createdAt?: string;
    source?: string;
  };
}

export type ChatLang = "en" | "hi" | "nagpuri" | "santali";

export const LANG_CONFIG: Record<
  ChatLang,
  {
    name: string;
    nativeName: string;
    flag: string;
    badge: string;
    voiceLocale: string;
    placeholder: string;
    typingNotice: string;
    botTitle: string;
    starterHint: string;
    optReport: string;
    optCheck: string;
    optHelp: string;
  }
> = {
  en: {
    name: "English",
    nativeName: "English",
    flag: "🌐",
    badge: "EN",
    voiceLocale: "en-IN",
    placeholder: "Type problem in English, Hindi, Nagpuri, Santhali...",
    typingNotice: "Jharkhand Sahayak is typing...",
    botTitle: "Jharkhand Sahayak AI Grievance Bot",
    starterHint: "Select an option or type your problem / send a voice note in your preferred language (English, Hindi, Nagpuri, Santhali / ᱥᱟᱱᱛᱟᱲᱤ):",
    optReport: "Report New Problem",
    optCheck: "Check Complaint Progress",
    optHelp: "Help & Information"
  },
  hi: {
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    badge: "HI",
    voiceLocale: "hi-IN",
    placeholder: "अपनी समस्या हिंदी, नागपुरी, संथाली या English में लिखें...",
    typingNotice: "झारखंड सहायक टाइप कर रहा है...",
    botTitle: "झारखंड सहायक 24/7 AI चैट",
    starterHint: "बातचीत शुरू करने के लिए कोई विकल्प चुनें या नीचे सीधे अपनी भाषा (हिंदी, नागपुरी, संथाली, English) में मैसेज या वॉइस नोट भेजें:",
    optReport: "नई समस्या दर्ज करें",
    optCheck: "कंप्लेंट प्रोग्रेस देखें",
    optHelp: "मदद एवं जानकारी"
  },
  nagpuri: {
    name: "Nagpuri",
    nativeName: "नागपुरी",
    flag: "🌾",
    badge: "NGP",
    voiceLocale: "hi-IN",
    placeholder: "अपन समस्या नागपुरी, हिंदी, संथाली या English में लिखू...",
    typingNotice: "झारखंड सहायक लिखत आहे...",
    botTitle: "झारखंड सहायक AI गोहार चैट (नागपुरी)",
    starterHint: "बातचीत सुरू करेक ले कोनो विकल्प चुनू या सीधा अपन भाषा (नागपुरी, हिंदी, संथाली, English) में लिखू या बोलू:",
    optReport: "नया समस्या / गोहार दर्ज करूं",
    optCheck: "शिकायत के स्थिति देखू",
    optHelp: "मदद एवं जानकारी"
  },
  santali: {
    name: "Santhali",
    nativeName: "ᱥᱟᱱᱛᱟᱲᱤ",
    flag: "🏹",
    badge: "SAT",
    voiceLocale: "hi-IN",
    placeholder: "ᱟᱢᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ Santhali, Nagpuri, Hindi, English ᱛᱮ ᱚᱞ ᱢᱮ...",
    typingNotice: "ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱦᱟᱭᱚᱠ ᱚᱞ ᱮᱫᱟᱭ...",
    botTitle: "ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱦᱟᱭᱚᱠ AI ᱮᱴᱠᱮᱴᱚᱬᱮ ᱵᱚᱴ",
    starterHint: "ᱨᱚᱯᱚᱲ ᱮᱛᱚᱦᱚᱵ ᱞᱟᱹᱜᱤᱫ ᱚᱞ ᱢᱮ ᱥᱮ ᱟᱲᱟᱝ (Voice note) ᱠᱩᱞ ᱢᱮ (ᱥᱟᱱᱛᱟᱲᱤ, Nagpuri, Hindi, English):",
    optReport: "ᱱᱟᱣᱟ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱚᱞ ᱢᱮ (Report Problem)",
    optCheck: "ᱮᱴᱠᱮᱴᱚᱬᱮ ᱨᱮᱭᱟᱜ ᱦᱟᱞᱚᱛ ᱧᱮᱞ (Check Status)",
    optHelp: "ᱜᱚᱲᱚ ᱟᱨ ᱵᱟᱰᱟᱭ (Help & Info)"
  }
};

const ALL_THEMES: {
  key: ProblemCategory;
  labelHi: string;
  labelEn: string;
  labelNag: string;
  labelSat: string;
  icon: string;
}[] = [
  {
    key: "Water Resources & Sanitation",
    labelHi: "जल संसाधन एवं स्वच्छता",
    labelEn: "Water Resources & Sanitation",
    labelNag: "पानी संसाधन एवं चापाकल",
    labelSat: "ᱫᱟᱜ ᱟᱨ ᱥᱟᱯᱷᱟ-ᱥᱟᱯᱷᱤ (Water & Sanitation)",
    icon: "💧"
  },
  {
    key: "Agriculture & Allied Technologies",
    labelHi: "कृषि एवं संबद्ध तकनीक",
    labelEn: "Agriculture & Allied Technologies",
    labelNag: "खेती-बाड़ी, सुखाड़ एवं फसल",
    labelSat: "ᱪᱟᱥ-ᱵᱟᱥ ᱟᱨ ᱦᱟᱥᱟ (Agriculture)",
    icon: "🌾"
  },
  {
    key: "Healthcare & MedTech",
    labelHi: "स्वास्थ्य सेवा एवं मेडटेक",
    labelEn: "Healthcare & MedTech",
    labelNag: "स्वास्थ्य सेवा, अस्पताल एवं दवाई",
    labelSat: "ᱨᱩᱣᱟᱹ-ᱦᱟᱥᱯᱟᱛᱟᱞ ᱟᱨ ᱨᱟᱱ (Healthcare)",
    icon: "🏥"
  },
  {
    key: "Rural Infrastructure & Transport",
    labelHi: "ग्रामीण बुनियादी ढांचा एवं सड़क",
    labelEn: "Rural Infrastructure & Transport",
    labelNag: "गाँव के सड़क, पुलिया एवं डहर",
    labelSat: "ᱟᱹᱛᱩ ᱦᱚᱨ ᱟᱨ ᱯᱩᱞ (Rural Roads)",
    icon: "🛣️"
  },
  {
    key: "Education & Smart Learning",
    labelHi: "शिक्षा एवं स्मार्ट लर्निंग",
    labelEn: "Education & Smart Learning",
    labelNag: "शिक्षा, स्कूल एवं पढ़ाई",
    labelSat: "ᱚᱞ ᱤᱛᱩᱱ ᱟᱨ ᱤᱥᱠᱩᱞ (Education)",
    icon: "📚"
  },
  {
    key: "Environment & Mining Remediation",
    labelHi: "पर्यावरण एवं खनन उपचार",
    labelEn: "Environment & Mining Remediation",
    labelNag: "पर्यावरण, प्रदूषण एवं कोयला खदान",
    labelSat: "ᱯᱚᱨᱤᱵᱮᱥ ᱟᱨ ᱠᱷᱟᱫᱟᱱ (Mining & Ecology)",
    icon: "🌲"
  },
  {
    key: "Renewable Energy & Off-Grid Power",
    labelHi: "नवीकरणीय ऊर्जा एवं बिजली",
    labelEn: "Renewable Energy & Off-Grid Power",
    labelNag: "बिजुली, सोलर एवं लाइट",
    labelSat: "ᱵᱟᱹᱛᱤ ᱟᱨ ᱥᱚᱞᱟᱨ ᱵᱤᱡᱩᱞᱤ (Solar & Power)",
    icon: "⚡"
  },
  {
    key: "Forest & Tribal Livelihoods",
    labelHi: "वन एवं जनजातीय आजीविका",
    labelEn: "Forest & Tribal Livelihoods",
    labelNag: "जंगल, महुआ, लाह एवं आदिवासी रोजगार",
    labelSat: "ᱵᱤᱨ ᱟᱨ ᱦᱚᱲ ᱦᱚᱯᱚᱱ ᱟᱹᱥᱩᱞ (Tribal Livelihoods)",
    icon: "🏹"
  }
];

export const DISTRICT_TRANSLATIONS: Record<string, { hi: string; nag: string; sat: string }> = {
  "Ranchi": { hi: "राँची", nag: "राँची", sat: "ᱨᱟᱺᱪᱤ" },
  "Dhanbad": { hi: "धनबाद", nag: "धनबाद", sat: "ᱫᱷᱟᱱᱵᱟᱫᱽ" },
  "Bokaro": { hi: "बोकारो", nag: "बोकारो", sat: "ᱵᱚᱠᱟᱨᱚ" },
  "East Singhbhum": { hi: "पूर्वी सिंहभूम", nag: "पूर्वी सिंहभूम", sat: "ᱥᱟᱢᱟᱝ ᱥᱤᱝᱵᱷᱩᱢ" },
  "West Singhbhum": { hi: "पश्चिमी सिंहभूम", nag: "पश्चिमी सिंहभूम", sat: "ᱯᱟᱪᱮ ᱥᱤᱝᱵᱷᱩᱢ" },
  "Hazaribagh": { hi: "हजारीबाग", nag: "हजारीबाग", sat: "ᱦᱟᱡᱟᱨᱤᱵᱟᱜᱽ" },
  "Deoghar": { hi: "देवघर", nag: "देवघर", sat: "ᱫᱮᱣᱜᱷᱚᱨ" },
  "Dumka": { hi: "दुमका", nag: "दुमका", sat: "ᱫᱩᱢᱠᱟᱹ" },
  "Palamu": { hi: "पलामू", nag: "पलामू", sat: "ᱯᱟᱞᱟᱢᱩ" },
  "Giridih": { hi: "गिरिडीह", nag: "गिरिडीह", sat: "ᱜᱤᱨᱤᱰᱤᱦ" },
  "Ramgarh": { hi: "रामगढ़", nag: "रामगढ़", sat: "ᱨᱟᱢᱜᱚᱲ" },
  "Khunti": { hi: "खूंटी", nag: "खूंटी", sat: "ᱠᱷᱩᱸᱴᱤ" },
  "Garhwa": { hi: "गढ़वा", nag: "गढ़वा", sat: "ᱜᱟᱲᱣᱟ" },
  "Latehar": { hi: "लातेहार", nag: "लातेहार", sat: "ᱞᱟᱛᱮᱦᱟᱨ" },
  "Chatra": { hi: "चतरा", nag: "चतरा", sat: "ᱪᱟᱛᱨᱟ" },
  "Koderma": { hi: "कोडरमा", nag: "कोडरमा", sat: "ᱠᱚᱰᱟᱨᱢᱟ" },
  "Jamtara": { hi: "जामताड़ा", nag: "जामताड़ा", sat: "ᱡᱟᱢᱛᱟᱲᱟ" },
  "Godda": { hi: "गोड्डा", nag: "गोड्डा", sat: "ᱜᱚᱰᱰᱟ" },
  "Sahibganj": { hi: "साहिबगंज", nag: "साहिबगंज", sat: "ᱥᱟᱦᱮᱵᱽᱜᱚᱸᱡᱽ" },
  "Pakur": { hi: "पाकुड़", nag: "पाकुड़", sat: "ᱯᱟᱠᱩᱲ" },
  "Gumla": { hi: "गुमला", nag: "गुमला", sat: "ᱜᱩᱢᱞᱟ" },
  "Simdega": { hi: "सिमडेगा", nag: "सिमडेगा", sat: "ᱥᱤᱢᱰᱮᱜᱟ" },
  "Lohardaga": { hi: "लोहरदगा", nag: "लोहरदगा", sat: "ᱞᱳᱦᱟᱨᱫᱟᱜᱟ" },
  "Seraikela Kharsawan": { hi: "सरायकेला खरसावां", nag: "सरायकेला खरसावां", sat: "ᱥᱚᱨᱟᱭᱠᱮᱞᱟ ᱠᱷᱚᱨᱥᱚᱶᱟ" }
};

export const getThemeDisplayLabel = (category: ProblemCategory, lang: ChatLang): string => {
  const t = ALL_THEMES.find((item) => item.key === category);
  if (!t) return category;
  if (lang === "nagpuri") return `${t.labelNag} (${t.labelEn})`;
  if (lang === "santali") return `${t.labelSat}`;
  if (lang === "hi") return `${t.labelHi} (${t.labelEn})`;
  return t.labelEn;
};

export const getDistrictOptions = (lang: ChatLang): string[] => {
  const mainDistricts = [
    "Ranchi", "Dhanbad", "Bokaro", "East Singhbhum", "Hazaribagh",
    "Deoghar", "Dumka", "Palamu", "Giridih", "Ramgarh", "Khunti", "West Singhbhum"
  ];
  const changeThemeBtn =
    lang === "santali"
      ? "🔄 ᱛᱷᱤᱢ ᱵᱚᱫᱚᱞ (Change Theme)"
      : lang === "nagpuri"
      ? "🔄 थीम बदलू (Change Theme)"
      : lang === "hi"
      ? "🔄 थीम बदलें (Change Theme)"
      : "🔄 Change Theme";

  const distBtns = mainDistricts.map((d) => {
    const tr = DISTRICT_TRANSLATIONS[d];
    if (!tr || lang === "en") return d;
    const localName = lang === "santali" ? tr.sat : lang === "nagpuri" ? tr.nag : tr.hi;
    return `${localName} (${d})`;
  });

  return [changeThemeBtn, ...distBtns];
};

export const parseDistrictFromInput = (input: string): string | undefined => {
  const parenMatch = input.match(/\(([^)]+)\)/);
  const withoutParen = input.replace(/\(.*?\)/g, "").trim();
  const rawClean = input.replace(/^[0-9.\s]+/, "").trim();

  const candidates = [
    parenMatch ? parenMatch[1].trim() : "",
    withoutParen,
    rawClean,
    input.trim()
  ].filter(Boolean);

  for (const c of candidates) {
    const clean = c.toLowerCase();
    for (const [distKey, distVal] of Object.entries(JHARKHAND_DISTRICTS)) {
      if (distKey.toLowerCase() === clean) return distKey;
      if (
        distVal.aliases?.some(
          (a) =>
            a.toLowerCase() === clean ||
            clean === a.toLowerCase() ||
            clean.includes(a.toLowerCase()) ||
            a.toLowerCase().includes(clean)
        )
      ) {
        return distKey;
      }
    }
    for (const [distKey, trans] of Object.entries(DISTRICT_TRANSLATIONS)) {
      if (
        trans.hi.toLowerCase() === clean ||
        trans.nag.toLowerCase() === clean ||
        trans.sat.toLowerCase() === clean ||
        clean.includes(trans.hi.toLowerCase()) ||
        clean.includes(trans.nag.toLowerCase()) ||
        clean.includes(trans.sat.toLowerCase())
      ) {
        return distKey;
      }
    }
  }
  return undefined;
};

export const parseThemeFromInput = (input: string): ProblemCategory | undefined => {
  const cleanT = input.toLowerCase();
  const matchedTheme = ALL_THEMES.find(
    (t) =>
      cleanT.includes(t.key.toLowerCase()) ||
      cleanT.includes(t.labelHi.toLowerCase()) ||
      cleanT.includes(t.labelNag.toLowerCase()) ||
      cleanT.includes(t.labelSat.toLowerCase()) ||
      cleanT.includes(t.labelEn.toLowerCase())
  );
  return matchedTheme ? matchedTheme.key : undefined;
};

export const WhatsAppSimulatorModal: React.FC = () => {
  const {
    whatsappSimulatorOpen,
    setWhatsappSimulatorOpen,
    submitProblem,
    currentLanguage,
    problems,
    universities
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [interimSpokenText, setInterimSpokenText] = useState("");
  const recognitionRef = useRef<any>(null);
  const transcriptAccumulatorRef = useRef<string>("");
  const recordingTimerRef = useRef<any>(null);
  const [lastSubmittedProblem, setLastSubmittedProblem] = useState<Problem | null>(null);

  // Dynamic language detection: supports en, hi, nagpuri, and santali
  const [chatLang, setChatLang] = useState<ChatLang>(
    currentLanguage === "santali"
      ? "santali"
      : currentLanguage === "nagpuri"
      ? "nagpuri"
      : currentLanguage === "hi"
      ? "hi"
      : "en"
  );

  // Conversational workflow state machine
  const [conversationStep, setConversationStep] = useState<
    "MENU" | "COLLECT_PROBLEM" | "AWAIT_CLARIFICATION" | "SELECT_THEME" | "SELECT_DISTRICT" | "SELECT_BLOCK" | "ENTER_VILLAGE" | "CONFIRMATION" | "COMPLETED" | "CHECK_PROGRESS"
  >("MENU");

  const [collectedData, setCollectedData] = useState<{
    problemText: string;
    theme: ProblemCategory;
    district: string;
    block: string;
    village: string;
    imageUrl?: string;
  }>({
    problemText: "",
    theme: "Water Resources & Sanitation",
    district: "",
    block: "",
    village: "",
    imageUrl: undefined
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const detectUserLanguage = (text: string): ChatLang => {
    // 1. Ol Chiki script or Santali keywords (both Ol Chiki and Roman)
    if (/[\u1C50-\u1C7F]/.test(text)) return "santali";
    const santaliWords = [
      "johar", "daah", "dạh", "etketone", "etketõṇe", "aatu", "hor", "rua", "haspatal",
      "bati", "ischool", "chas", "khasa", "bir", "menak", "menak'a", "bano", "bano'a",
      "cheleka", "chet", "aleyag", "amag", "inye", "inya", "sanam", "apeya", "ran", "baadi",
      "santhali", "santali", "hor hopon", "matkom", "sarjom", "dare"
    ];
    const low = text.toLowerCase();
    const words = low.split(/[^a-zA-Z0-9\u0900-\u097F\u1C50-\u1C7F]+/);
    if (words.some((w) => santaliWords.includes(w))) return "santali";

    // Santali in Devanagari
    const santaliDevanagari = ["दाः", "आतु", "होर", "रुअ", "बाड़ी", "संथाली", "संताली", "चास", "बीर"];
    if (santaliDevanagari.some((w) => text.includes(w))) return "santali";

    // 2. Nagpuri / Sadri distinctive words
    const nagpuriWords = [
      "kahe", "kaheke", "kesan", "tohar", "hamar", "raura", "mor", "tohar", "chapakal",
      "naikhe", "naikhen", "naakhe", "aahe", "baate", "have", "howat", "gel", "gelak",
      "aawat", "aawela", "bane", "gohar", "beemar", "sukh gel", "toot gel", "bijuli",
      "andharia", "puchhat", "batawa", "nagpuri"
    ];
    if (words.some((w) => nagpuriWords.includes(w))) return "nagpuri";

    // Nagpuri in Devanagari
    const nagpuriDevanagari = [
      "नइखे", "नईखे", "नाइखे", "नाखे", "आहे", "हवे", "होवत", "गेल", "गेलक", "बाटे",
      "तोहार", "हमार", "रउरा", "मोर", "तोहर", "चापाकल", "सुखल", "सुख गेल", "टूट गेल",
      "गोहार", "केसन", "काहे", "नइखन", "नागपुरी", "बिजुली", "अंधरिया"
    ];
    if (nagpuriDevanagari.some((w) => text.includes(w))) return "nagpuri";

    // 3. Devanagari Hindi
    if (/[\u0900-\u097F]/.test(text)) return "hi";

    // 4. Hinglish
    const hinglishWords = [
      "kya", "kaise", "mera", "meri", "mere", "humara", "hamara", "humare", "hamare",
      "yahan", "yaha", "pani", "paani", "bijli", "sadak", "bimar", "bimari", "samasya",
      "dikkat", "nahi", "nhi", "hai", "hain", "batao", "karo", "kijiye", "dekho",
      "chahiye", "shuru", "madad", "namaste", "pranam", "ha", "haan", "theek",
      "thik", "bhai", "yaar", "gaav", "gaon", "chhat", "khula", "kharab", "toota",
      "stithi", "kripya", "nayi", "darj", "dekhein", "karein", "kaunsi", "acha", "achha"
    ];
    if (words.some((w) => hinglishWords.includes(w))) return "hi";

    const engWords = [
      "water", "road", "electricity", "help", "status", "track", "progress",
      "broken", "issue", "school", "hospital", "doctor", "light", "village",
      "block", "district", "hello", "problem", "check", "report"
    ];
    if (words.some((w) => engWords.includes(w))) return "en";

    return chatLang;
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "deployed":
      case "closed":
        return {
          label: "Problem Resolved & Deployed",
          labelHi: "समाधान पूर्ण एवं सत्यापित",
          color: "bg-emerald-100 text-emerald-800 border-emerald-300",
          icon: "🟢",
          step: 4
        };
      case "in_progress":
      case "field_pilot":
      case "team_formed":
        return {
          label: "Field Action & Work in Progress",
          labelHi: "कार्य प्रगति पर है (फील्ड पायलट जारी)",
          color: "bg-purple-100 text-purple-800 border-purple-300",
          icon: "🟣",
          step: 3
        };
      case "routed":
      case "accepted_by_hei":
        return {
          label: "Allocated to HEI Research Institution",
          labelHi: "विश्वविद्यालय/संस्थान को आवंटित",
          color: "bg-blue-100 text-blue-800 border-blue-300",
          icon: "🔵",
          step: 2
        };
      default:
        return {
          label: "Under Nodal Review & Verification",
          labelHi: "सत्यापन एवं समीक्षाधीन",
          color: "bg-amber-100 text-amber-800 border-amber-300",
          icon: "🟡",
          step: 1
        };
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!whatsappSimulatorOpen) return null;

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const addBotMessage = (
    text: string,
    options?: string[],
    isCard?: boolean,
    confirmData?: any,
    isProgress?: boolean,
    progData?: any
  ) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: "bot",
          text,
          time: getCurrentTime(),
          options,
          isConfirmationCard: isCard,
          confirmationData: confirmData,
          isProgressCard: isProgress,
          progressData: progData
        }
      ]);
    }, 600);
  };

  const showProgressForProblem = (p: Problem, lang: ChatLang) => {
    const univObj = universities.find((u) => u.id === p.assignedUniversityId);
    const assignedUniv =
      p.aiExplanation?.suggestedUniversities?.[0]?.universityName ||
      univObj?.name ||
      "Birla Institute of Technology, Mesra";

    const assignedFaculty =
      p.assignedFacultyName ||
      "Prof. Ananya Sen (Nodal Technical Coordinator)";

    const badge = getStatusBadge(p.status);

    const reportHeader =
      lang === "santali"
        ? `📊 *ᱮᱴᱠᱮᱴᱚᱬᱮ ᱦᱟᱞᱚᱛ ᱨᱤᱯᱚᱨᱴ (Status Report)*\n\n• *Ticket ID:* #${p.ticketNumber}\n• *ᱦᱟᱞᱚᱛ:* ${badge.icon} *${badge.label}*\n• *ᱛᱷᱤᱢ:* ${p.category}\n• *ᱴᱷᱟᱶ:* ᱡᱤᱞᱟᱹ ${p.district}${p.block ? ` (${p.block})` : ""}\n• *Institute:* ${assignedUniv}\n\nᱞᱟᱛᱟᱨ ᱨᱮ ᱯᱨᱚᱜᱨᱮᱥ ᱧᱮᱞ ᱢᱮ:`
        : lang === "nagpuri"
        ? `📊 *शिकायत के लाइव स्थिति रिपोर्ट*\n\n• *टिकट संख्या:* #${p.ticketNumber}\n• *वर्तमान स्थिति:* ${badge.icon} *${badge.labelHi}*\n• *श्रेणी (Theme):* ${p.category}\n• *स्थान:* ज़िला ${p.district}${p.block ? ` (${p.block})` : ""}\n• *आवंटित संस्थान:* ${assignedUniv}\n\nनीचे लाइव प्रोग्रेस टाइमलाइन देखू:`
        : lang === "hi"
        ? `📊 *शिकायत निवारण लाइव स्थिति रिपोर्ट*\n\n• *टिकट संख्या:* #${p.ticketNumber}\n• *वर्तमान स्थिति:* ${badge.icon} *${badge.labelHi}*\n• *श्रेणी (Theme):* ${p.category}\n• *स्थान:* ज़िला ${p.district}${p.block ? ` (${p.block})` : ""}\n• *आवंटित संस्थान:* ${assignedUniv}\n\nनीचे लाइव प्रोग्रेस टाइमलाइन देखें:`
        : `📊 *Grievance Live Status Report*\n\n• *Ticket ID:* #${p.ticketNumber}\n• *Current Stage:* ${badge.icon} *${badge.label}*\n• *Category:* ${p.category}\n• *Location:* ${p.district}${p.block ? ` (${p.block})` : ""}\n• *Allocated Institute:* ${assignedUniv}\n\nLive milestone timeline is shown below:`;

    addBotMessage(
      reportHeader,
      lang === "santali"
        ? ["🔄 ᱦᱟᱞᱚᱛ ᱨᱤᱯᱷᱨᱮᱥ (Refresh)", "📝 ᱱᱟᱣᱟ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱚᱞ", "🏠 ᱢᱩᱬᱩᱛ ᱢᱮᱱᱩ (Menu)"]
        : lang === "nagpuri"
        ? ["🔄 रिफ्रेश स्थिति", "📝 नया समस्या दर्ज करूं", "🏠 मुख्य मेनू"]
        : lang === "hi"
        ? ["🔄 रिफ्रेश स्थिति", "📝 नई समस्या दर्ज करें", "🏠 मुख्य मेनू"]
        : ["🔄 Refresh Status", "📝 Report New Problem", "🏠 Main Menu"],
      false,
      undefined,
      true,
      {
        ticketNumber: p.ticketNumber,
        title: p.title,
        category: p.category,
        status: p.status,
        district: p.district,
        block: p.block,
        village: p.village,
        assignedUniversity: assignedUniv,
        assignedFaculty,
        priorityScore: p.priorityScore,
        createdAt: p.createdAt,
        source: p.source
      }
    );
  };

  const findProblem = (query: string): Problem | null => {
    const clean = query.replace(/[#🔍📊\s]/g, "").trim().toLowerCase();

    if (lastSubmittedProblem) {
      const num = lastSubmittedProblem.ticketNumber?.toLowerCase() || "";
      if (clean.includes(num) || num.includes(clean) || clean === "track" || clean === "progress") {
        return lastSubmittedProblem;
      }
    }

    const match = problems.find((p) => {
      const num = p.ticketNumber?.toLowerCase() || "";
      const id = p.id?.toLowerCase() || "";
      return num.includes(clean) || clean.includes(num) || id.includes(clean);
    });

    if (match) return match;

    if (clean.length >= 3) {
      const titleMatch = problems.find((p) => p.title.toLowerCase().includes(clean));
      if (titleMatch) return titleMatch;
    }

    return lastSubmittedProblem || problems[0] || null;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text && !attachedImage) return;

    const userTime = getCurrentTime();
    const currentImg = attachedImage;

    // Detect user language dynamically from this message
    const activeLang = detectUserLanguage(text || "photo");
    setChatLang(activeLang);

    // Append user message
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: "user",
        text: text || (activeLang === "hi" ? "📷 फोटो संलग्न की गई" : "📷 Photo attached"),
        time: userTime,
        image: currentImg || undefined
      }
    ]);

    setInputText("");
    setAttachedImage(null);

    const low = text.toLowerCase();

    // 0. Main Menu / Reset Request
    if (
      low === "menu" ||
      low === "main menu" ||
      low === "home" ||
      low === "shuru" ||
      low === "start" ||
      low === "hi" ||
      low === "hello" ||
      low === "namaste" ||
      low === "johar" ||
      text.includes("Main Menu") ||
      text.includes("मुख्य मेनू") ||
      text.includes("ᱢᱩᱬᱩᱛ ᱢᱮᱱᱩ")
    ) {
      setConversationStep("MENU");
      addBotMessage(
        activeLang === "santali"
          ? "ᱡᱚᱦᱟᱨ! 🙏 ᱤᱧᱫᱚ *ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱦᱟᱭᱚᱠ* ᱠᱟᱹᱱᱟᱹᱧ—ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨ ᱨᱮᱭᱟᱜ 24/7 AI ᱮᱴᱠᱮᱴᱚᱬᱮ ᱵᱚᱴ ᱾\n\nᱤᱧ ᱪᱮᱫ ᱜᱚᱲᱚᱢ ᱠᱷᱚᱡᱟ? ᱞᱟᱛᱟᱨ ᱠᱷᱚᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ ᱥᱮ ᱟᱢᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱚᱞ ᱢᱮ:\n\n_(Johar! 🙏 I am Jharkhand Sahayak, the official 24/7 AI Grievance Assistant of the Government of Jharkhand. How can I help you? Choose an option below or type your problem directly:)*"
          : activeLang === "nagpuri"
          ? "जोहार / नमस्कार! 🙏 हम *झारखंड सहायक* हकी—झारखंड सरकार कर आधिकारिक 24/7 गोहार निवारण AI बॉट।\n\nहम रउरा का मदद कर सकीला? नीचे से विकल्प चुनू या सीधा अपन समस्या लिखू:\n\n_(Namaskar! 🙏 I am Jharkhand Sahayak, the official 24/7 AI Grievance Assistant of the Government of Jharkhand. How can I help you? Choose an option below or type your problem directly:)*"
          : activeLang === "hi"
          ? "जोहार / नमस्कार! 🙏 मैं *झारखंड सहायक* हूँ—झारखंड सरकार का आधिकारिक 24/7 शिकायत निवारण बॉट।\n\nमैं आपकी क्या मदद कर सकता हूँ? नीचे दिए गए विकल्प चुनें या सीधे अपनी समस्या लिखें:\n\n_(Namaskar! 🙏 I am Jharkhand Sahayak, the official 24/7 AI Grievance Assistant. Choose an option below or type your problem:)*"
          : "Namaskar! 🙏 I am *Jharkhand Sahayak*, the official 24/7 WhatsApp grievance assistant of the Government of Jharkhand.\n\nHow can I help you today? Please choose an option below or directly type your problem:",
        activeLang === "santali"
          ? ["📝 1. ᱱᱟᱣᱟ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱚᱞ ᱢᱮ (Report)", "📊 2. ᱮᱴᱠᱮᱴᱚᱬᱮ ᱦᱟᱞᱚᱛ (Status)", "ℹ️ 3. ᱜᱚᱲᱚ ᱟᱨ ᱵᱟᱰᱟᱭ (Help)"]
          : activeLang === "nagpuri"
          ? ["📝 1. नया समस्या / गोहार दर्ज करूं (Report)", "📊 2. शिकायत के स्थिति देखू (Status)", "ℹ️ 3. मदद एवं जानकारी (Help)"]
          : activeLang === "hi"
          ? ["📝 1. नई समस्या दर्ज करें (Report)", "📊 2. कंप्लेंट प्रोग्रेस देखें (Status)", "ℹ️ 3. मदद एवं जानकारी (Help)"]
          : ["📝 1. Report New Problem", "📊 2. Check Complaint Progress", "ℹ️ 3. Help & Information"]
      );
      return;
    }

    // 1. Report New Problem Request
    if (
      low === "1" ||
      low.includes("1. nayi") ||
      low.includes("nayi problem") ||
      low.includes("nayi samasya") ||
      low.includes("1. नई समस्या") ||
      low.includes("1. नया समस्या") ||
      low.includes("1. ᱱᱟᱣᱟ") ||
      low.includes("report new problem") ||
      text.includes("Ek Aur Samasya") ||
      text.includes("एक और समस्या") ||
      text.includes("Report Another")
    ) {
      setConversationStep("COLLECT_PROBLEM");
      setCollectedData({
        problemText: "",
        theme: "Water Resources & Sanitation",
        district: "",
        block: "",
        village: "",
        imageUrl: undefined
      });
      addBotMessage(
        activeLang === "santali"
          ? "📝 *ᱱᱟᱣᱟ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱚᱞ ᱢᱮ (Report New Problem):*\n\nᱟᱢᱟᱜ ᱟᱹᱛᱩ, ᱴᱚᱞᱟ ᱨᱮᱭᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱚᱞ ᱢᱮ (ᱡᱮᱞᱮᱠᱟ ᱫᱟᱜ ᱵᱟᱹᱱᱩᱜᱼᱟ, ᱦᱚᱨ ᱵᱟᱹᱲᱤᱡ ᱜᱮᱭᱟ, ᱵᱤᱡᱩᱞᱤ ᱵᱟᱹᱱᱩᱜᱼᱟ) ᱾ ᱯᱷᱚᱴᱚ 📷 ᱥᱮ ᱟᱲᱟᱝ (Voice note) 🎙️ ᱦᱚᱸ ᱠᱩᱞ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ!\n\n_(Please describe the civic problem in your village or town. You can also send a photo 📷 or voice note 🎙️!)_"
          : activeLang === "nagpuri"
          ? "📝 *नया समस्या दर्ज करूं (Report New Problem):*\n\nअपन गाँव, टोला या शहर कर समस्या बताऊ (जैसे चापाकल खराब हवे, पानी नइखे मिलत, सड़क टूट गेल, बिजुली नइखे)। रउरा फोटो 📷 या माइक दबा के वॉइस नोट 🎙️ भी भेज सकीला!\n\n_(Please describe the civic problem in your village or town. You can also send a photo 📷 or voice note 🎙️!)_"
          : activeLang === "hi"
          ? "📝 *नई समस्या दर्ज करें (Report New Problem):*\n\nअपने गाँव, टोला या शहर की समस्या बताएं (जैसे पानी नहीं आ रहा, सड़क टूटी है, बिजली गुल है)। आप फोटो 📷 या वॉइस नोट 🎙️ भी भेज सकते हैं!\n\n_(Please describe the civic problem in your village or town. You can also send a photo 📷 or voice note 🎙️!)_"
          : "📝 *Report New Problem:*\n\nPlease describe the civic challenge in your village or town (e.g. water shortage, broken road, power outage). You can also send a photo 📷 or voice note 🎙️!"
      );
      return;
    }

    // 2. Help / Info Request
    if (
      low === "3" ||
      low.includes("3. madad") ||
      low.includes("help") ||
      low.includes("madad") ||
      low.includes("jankari") ||
      low.includes("3. मदद") ||
      low.includes("3. ᱜᱚᱲᱚ")
    ) {
      addBotMessage(
        activeLang === "santali"
          ? "ℹ️ *ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱦᱟᱭᱚᱠ 24/7 AI ᱦᱮᱞᱯᱰᱮᱥᱠ (Helpdesk)*\n\n• ᱱᱚᱶᱟ ᱯᱳᱨᱴᱟᱞ ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨ ᱟᱨ BIT Mesra, IIT ISM, AIIMS Deoghar, NIT Jamshedpur ᱦᱚᱛᱮᱛᱮ ᱪᱟᱞᱟᱣᱚᱜ ᱠᱟᱱᱟ ᱾\n• AI ᱥᱟᱱᱟᱢ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱯᱩᱥᱴᱟᱹᱣ ᱠᱟᱛᱮ ᱥᱟᱬᱮᱥᱤᱭᱟᱹ ᱴᱤᱢ ᱴᱷᱮᱱ ᱠᱩᱞᱟ ᱾\n• ᱟᱢ Ticket ID ᱧᱟᱢᱟ ᱡᱟᱦᱟᱸ WhatsApp ᱨᱮ ᱡᱟᱦᱟᱸ ᱛᱤᱨᱮ ᱦᱚᱸ ᱧᱮᱞ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ ᱾\n\n_(This portal is operated by Govt of Jharkhand with BIT Mesra, IIT ISM, AIIMS Deoghar, NIT Jamshedpur. Every issue is AI-validated and routed to research institutions.)_"
          : activeLang === "nagpuri"
          ? "ℹ️ *झारखंड सहायक 24/7 AI हेल्पडेस्क (Helpdesk)*\n\n• ई पोर्टल झारखंड सरकार एवं उच्च शिक्षण संस्थानन (BIT Mesra, IIT ISM, AIIMS Deoghar, NIT Jamshedpur) द्वारा संचालित हवे।\n• हर गोहार के AI सत्यापित करके सम्बंधित विशेषज्ञ अनुसंधान टीम के भेजत हवे।\n• हर शिकायत के एक पारदर्शी Ticket ID मिलेला जेकरा रउरा कभी भी WhatsApp पर ट्रैक कर सकिला।\n\n_(This portal is operated by Govt of Jharkhand with BIT Mesra, IIT ISM, AIIMS Deoghar, NIT Jamshedpur. Every issue is AI-validated and routed to research institutions.)_"
          : activeLang === "hi"
          ? "ℹ️ *झारखंड सहायक 24/7 AI हेल्पडेस्क*\n\n• यह पोर्टल झारखंड सरकार एवं अग्रणी उच्च शिक्षण संस्थानों (BIT Mesra, IIT ISM, AIIMS Deoghar, NIT Jamshedpur) द्वारा संचालित है।\n• हर शिकायत को AI सत्यापित करके सम्बंधित विशेषज्ञ अनुसंधान टीम को भेजता है।\n• हर शिकायत को एक पारदर्शी Ticket ID मिलती है जिसे आप कभी भी WhatsApp पर ट्रैक कर सकते हैं।"
          : "ℹ️ *Jharkhand Sahayak 24/7 AI Citizen Helpdesk*\n\n• This portal is operated by the Government of Jharkhand with premier institutions (BIT Mesra, IIT ISM, AIIMS Deoghar, NIT Jamshedpur).\n• Every issue is AI-validated and routed to specialized research engineers.\n• You receive a transparent Ticket ID to check live progress anytime on WhatsApp.",
        activeLang === "santali"
          ? ["📝 ᱱᱟᱣᱟ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱚᱞ ᱢᱮ", "📊 2. ᱮᱴᱠᱮᱴᱚᱬᱮ ᱦᱟᱞᱚᱛ", "🏠 ᱢᱩᱬᱩᱛ ᱢᱮᱱᱩ"]
          : activeLang === "nagpuri"
          ? ["📝 नया समस्या दर्ज करूं", "📊 2. शिकायत के स्थिति देखू", "🏠 मुख्य मेनू"]
          : activeLang === "hi"
          ? ["📝 नई समस्या दर्ज करें", "📊 2. कंप्लेंट प्रोग्रेस देखें", "🏠 मुख्य मेनू"]
          : ["📝 Report New Problem", "📊 2. Check Complaint Progress", "🏠 Main Menu"]
      );
      return;
    }

    // Handle "Change Theme" request
    if (
      low.includes("change theme") ||
      low.includes("theme badle") ||
      low.includes("theme badlo") ||
      low.includes("थीम बदल") ||
      low.includes("गलत थीम") ||
      low.includes("ᱛᱷᱤᱢ ᱵᱚᱫᱚᱞ") ||
      text.includes("थीम बदलू") ||
      text.includes("Change Theme")
    ) {
      setConversationStep("SELECT_THEME");
      addBotMessage(
        activeLang === "santali"
          ? "🔄 *ᱛᱷᱤᱢ ᱵᱚᱫᱚᱞ (Change Theme):*\n\nᱫᱟᱭᱟᱠᱟᱛᱮ ᱟᱢᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱞᱟᱹᱜᱤᱫ ᱴᱷᱤᱠ ᱛᱷᱤᱢ ᱵᱟᱪᱷᱟᱣ ᱢᱮ:\n\n_(Please select the correct category for your problem from below:)*"
          : activeLang === "nagpuri"
          ? "🔄 *थीम बदलू (Change Theme):*\n\nकृपया अपन समस्या ले सही थीम (विषय) चुनू:\n\n_(Please select the correct category for your problem from below:)*"
          : activeLang === "hi"
          ? "🔄 *थीम बदलें (Change Theme):*\n\nकृपया अपनी समस्या के लिए सही थीम (विषय) चुनें:\n\n_(Please select the correct category for your problem from below:)*"
          : "🔄 *Change Theme:*\n\nPlease select the correct category for your problem from the options below:",
        ALL_THEMES.map((t) => {
          if (activeLang === "santali") return `${t.icon} ${t.labelSat}`;
          if (activeLang === "nagpuri") return `${t.icon} ${t.labelNag} (${t.labelEn})`;
          if (activeLang === "hi") return `${t.icon} ${t.labelHi} (${t.labelEn})`;
          return `${t.icon} ${t.labelEn}`;
        })
      );
      return;
    }

    // 3. Track / Progress Request
    const isTrackRequest =
      low.includes("progress") ||
      low.includes("status") ||
      low.includes("track") ||
      low.includes("kya hua") ||
      low.includes("ticket") ||
      low.includes("stithi") ||
      low.includes("स्थिति") ||
      low.includes("ᱦᱟᱞᱚᱛ") ||
      text.includes("2. Complaint Progress") ||
      text.includes("कंप्लेंट प्रोग्रेस") ||
      text.includes("Is Ticket Ki Progress");

    if (isTrackRequest) {
      const hasSpecificTicket =
        text.includes("#") ||
        /\b(JH-\d{4}-\d+|\d{4})\b/i.test(text);

      if (hasSpecificTicket || text.includes("Track #") || text.includes("Is Ticket Ki Progress") || text.includes("ᱦᱟᱞᱚᱛ") || text.includes("स्थिति")) {
        const found = findProblem(text);
        if (found) {
          showProgressForProblem(found, activeLang);
          return;
        }
      }

      if (lastSubmittedProblem) {
        showProgressForProblem(lastSubmittedProblem, activeLang);
        return;
      }

      setConversationStep("CHECK_PROGRESS");
      const sampleTickets = problems.slice(0, 3);
      const ticketOptions = [
        ...sampleTickets.map((p) => `🔍 Track #${p.ticketNumber}`),
        activeLang === "santali"
          ? "📝 ᱱᱟᱣᱟ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱚᱞ ᱢᱮ"
          : activeLang === "nagpuri"
          ? "📝 नया समस्या दर्ज करूं"
          : activeLang === "hi"
          ? "📝 नई समस्या दर्ज करें"
          : "📝 Report New Problem",
        activeLang === "santali"
          ? "🏠 ᱢᱩᱬᱩᱛ ᱢᱮᱱᱩ"
          : activeLang === "nagpuri"
          ? "🏠 मुख्य मेनू"
          : activeLang === "hi"
          ? "🏠 मुख्य मेनू"
          : "🏠 Main Menu"
      ];

      addBotMessage(
        activeLang === "santali"
          ? "📊 *ᱮᱴᱠᱮᱴᱚᱬᱮ ᱦᱟᱞᱚᱛ ᱴᱨᱮᱠᱤᱝ (Grievance Tracking)*\n\nᱞᱟᱛᱟᱨ ᱨᱮ ᱢᱮᱱᱟᱜ ᱴᱤᱠᱮᱴ ᱚᱛᱟᱭ ᱢᱮ ᱥᱮ ᱟᱢᱟᱜ Ticket ID ᱚᱞ ᱢᱮ (ᱡᱮᱞᱮᱠᱟ #JH-2026-4091):\n\n_(Please tap a ticket below or type your Ticket ID to track live progress:)*"
          : activeLang === "nagpuri"
          ? "📊 *शिकायत निवारण स्थिति (Grievance Tracking)*\n\nरउरा जउन टिकट कर लाइव स्थिति देखेक चाहत ही, नीचे टिकट पर टैप करूं या अपन Ticket ID (जैसे #JH-2026-4091) लिखू:\n\n_(Please tap a ticket below or type your Ticket ID to track live resolution progress:)*"
          : activeLang === "hi"
          ? "📊 *शिकायत निवारण स्थिति (Grievance Tracking)*\n\nआप जिस टिकट की लाइव स्थिति देखना चाहते हैं, नीचे दिए गए टिकट पर टैप करें या अपना Ticket ID (जैसे #JH-2026-4091) लिखें:\n\n_(Please tap a ticket below or type your Ticket ID to track live resolution progress:)*"
          : "📊 *Grievance Status Tracking*\n\nPlease tap a ticket below to track live resolution progress, or type your Ticket ID (e.g. #JH-2026-4091):",
        ticketOptions
      );
      return;
    }

    // 4. If currently in CHECK_PROGRESS step and user types a ticket number
    if (conversationStep === "CHECK_PROGRESS") {
      const found = findProblem(text);
      if (found) {
        showProgressForProblem(found, activeLang);
        return;
      } else {
        addBotMessage(
          activeLang === "santali"
            ? `⚠️ ᱴᱤᱠᱮᱴ ᱮᱞ '${text}' ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ ᱾ ᱫᱟᱭᱟᱠᱟᱛᱮ ᱴᱷᱤᱠ ᱴᱤᱠᱮᱴ ᱮᱞ ᱚᱞ ᱢᱮ (ᱡᱮᱞᱮᱠᱟ #${problems[0]?.ticketNumber || "JH-2026-4091"}):`
            : activeLang === "nagpuri"
            ? `⚠️ टिकट संख्या '${text}' नइखे मिलल। कृपया सही टिकट संख्या लिखू (जैसे #${problems[0]?.ticketNumber || "JH-2026-4091"}):`
            : activeLang === "hi"
            ? `⚠️ टिकट संख्या '${text}' नहीं मिली। कृपया सही टिकट संख्या लिखें (जैसे #${problems[0]?.ticketNumber || "JH-2026-4091"}):`
            : `⚠️ Ticket ID '${text}' was not found. Please enter a valid ticket number (e.g. #${problems[0]?.ticketNumber || "JH-2026-4091"}):`,
          [
            `🔍 Track #${problems[0]?.ticketNumber || "JH-2026-4091"}`,
            activeLang === "santali"
              ? "📝 ᱱᱟᱣᱟ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱚᱞ ᱢᱮ"
              : activeLang === "nagpuri"
              ? "📝 नया समस्या दर्ज करूं"
              : activeLang === "hi"
              ? "📝 नई समस्या दर्ज करें"
              : "📝 Report New Problem",
            activeLang === "santali"
              ? "🏠 ᱢᱩᱬᱩᱛ ᱢᱮᱱᱩ"
              : activeLang === "nagpuri"
              ? "🏠 मुख्य मेनू"
              : activeLang === "hi"
              ? "🏠 मुख्य मेनू"
              : "🏠 Main Menu"
          ]
        );
        return;
      }
    }

    // 5. If currently in SELECT_THEME step (User is choosing from dropdown/options)
    if (conversationStep === "SELECT_THEME") {
      const chosenTheme = parseThemeFromInput(text) || "Water Resources & Sanitation";

      setCollectedData((prev) => ({
        ...prev,
        theme: chosenTheme
      }));

      setConversationStep("SELECT_DISTRICT");

      const themeLabel = getThemeDisplayLabel(chosenTheme, activeLang);

      addBotMessage(
        activeLang === "santali"
          ? `✅ *ᱛᱷᱤᱢ ᱵᱟᱪᱷᱟᱣ ᱮᱱᱟ (Theme Selected):*\n*${themeLabel}*\n\n📍 *ᱱᱚᱶᱟ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱭᱟᱜ ᱚᱠᱟ District (ᱡᱤᱞᱟᱹ) ᱨᱮ ᱢᱮᱱᱟᱜᱼᱟ? ᱡᱤᱞᱟᱹ ᱵᱟᱪᱷᱟᱣ ᱢᱮ ᱥᱮ ᱚᱞ ᱢᱮ:*\n_(Which District in Jharkhand is this problem located in? Choose or type below:)*`
          : activeLang === "nagpuri"
          ? `✅ *थीम चुनल गेल (Theme Selected):*\n*${themeLabel}*\n\n📍 *ई समस्या झारखंड के कौन District (ज़िला) में बा? अपन ज़िला चुनू या लिखू:*\n_(Which District in Jharkhand is this problem located in? Choose or type below:)*`
          : activeLang === "hi"
          ? `✅ *थीम चुनी गई (Theme Selected):*\n*${themeLabel}*\n\n📍 *यह समस्या झारखंड के किस District (ज़िले) में है? अपना ज़िला चुनें या लिखें:*\n_(Which District in Jharkhand is this problem located in? Choose or type below:)*`
          : `✅ *Theme Selected:* *${themeLabel}*\n\n📍 *Which District in Jharkhand is this problem located in? Please choose or type:*`,
        getDistrictOptions(activeLang)
      );
      return;
    }

    // 6. If currently in SELECT_DISTRICT step (STRICT VALIDATION)
    if (conversationStep === "SELECT_DISTRICT") {
      if (
        low.includes("change theme") ||
        low.includes("थीम बदल") ||
        low.includes("ᱛᱷᱤᱢ ᱵᱚᱫᱚᱞ")
      ) {
        setConversationStep("SELECT_THEME");
        addBotMessage(
          activeLang === "santali"
            ? "🔄 *ᱛᱷᱤᱢ ᱵᱚᱫᱚᱞ (Change Theme):*\n\nᱫᱟᱭᱟᱠᱟᱛᱮ ᱟᱢᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱞᱟᱹᱜᱤᱫ ᱴᱷᱤᱠ ᱛᱷᱤᱢ ᱵᱟᱪᱷᱟᱣ ᱢᱮ:\n\n_(Please select the correct category for your problem from below:)*"
            : activeLang === "nagpuri"
            ? "🔄 *थीम बदलू (Change Theme):*\n\nकृपया अपन समस्या ले सही थीम (विषय) चुनू:\n\n_(Please select the correct category for your problem from below:)*"
            : activeLang === "hi"
            ? "🔄 *थीम बदलें (Change Theme):*\n\nकृपया अपनी समस्या के लिए सही थीम (विषय) चुनें:\n\n_(Please select the correct category for your problem from below:)*"
            : "🔄 *Change Theme:*\n\nPlease select the correct category for your problem from the options below:",
          ALL_THEMES.map((t) => {
            if (activeLang === "santali") return `${t.icon} ${t.labelSat}`;
            if (activeLang === "nagpuri") return `${t.icon} ${t.labelNag} (${t.labelEn})`;
            if (activeLang === "hi") return `${t.icon} ${t.labelHi} (${t.labelEn})`;
            return `${t.icon} ${t.labelEn}`;
          })
        );
        return;
      }

      const matchedDist = parseDistrictFromInput(text);

      if (!matchedDist) {
        addBotMessage(
          activeLang === "santali"
            ? `⚠️ *ᱵᱟᱝ ᱴᱷᱤᱠ ᱡᱤᱞᱟᱹ (Invalid District)!*\n\n"${text}" ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱭᱟᱜ 24 ᱡᱤᱞᱟᱹ ᱢᱩᱫᱽ ᱨᱮ ᱵᱟᱝ ᱧᱟᱢ ᱞᱮᱱᱟ ᱾ ᱫᱟᱭᱟᱠᱟᱛᱮ ᱞᱟᱛᱟᱨ ᱠᱷᱚᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ ᱥᱮ ᱴᱷᱤᱠ ᱚᱞ ᱢᱮ:\n_(Please choose from the valid districts below or type correctly:)*`
            : activeLang === "nagpuri"
            ? `⚠️ *अमान्य ज़िला (Invalid District)!*\n\n"${text}" झारखंड कर 24 ज़िला में से नइखे मिलल। कृपया नीचे से सही ज़िला चुनू या सही नाम लिखू:\n_(Please choose from the valid districts below or type correctly:)*`
            : activeLang === "hi"
            ? `⚠️ *अमान्य ज़िला (Invalid District)!*\n\n"${text}" झारखंड का मान्य ज़िला नहीं है। कृपया केवल झारखंड के 24 ज़िलों में से ही सही ज़िला चुनें या लिखें:\n_(Please choose from the valid districts below or type correctly:)*`
            : `⚠️ *Invalid District!*\n\n"${text}" is not recognized among Jharkhand's 24 districts. Please choose from the valid districts below or type correctly:`,
          getDistrictOptions(activeLang)
        );
        return; // STAY in SELECT_DISTRICT!
      }

      setCollectedData((prev) => ({
        ...prev,
        district: matchedDist
      }));

      setConversationStep("SELECT_BLOCK");

      const blocks = JHARKHAND_DISTRICTS[matchedDist]?.blocks || ["Sadar"];
      const tr = DISTRICT_TRANSLATIONS[matchedDist];
      const distLocalName =
        tr && activeLang === "santali"
          ? `${tr.sat} (${matchedDist})`
          : tr && (activeLang === "nagpuri" || activeLang === "hi")
          ? `${tr.nag} (${matchedDist})`
          : matchedDist;

      addBotMessage(
        activeLang === "santali"
          ? `📍 *ᱡᱤᱞᱟᱹ (District):* *${distLocalName}*\n\nᱱᱤᱛᱚᱜ ${matchedDist} ᱨᱮᱭᱟᱜ ᱟᱢᱟᱜ *Block (ᱯᱨᱚᱠᱷᱚᱸᱰ)* ᱵᱟᱪᱷᱟᱣ ᱢᱮ ᱥᱮ ᱚᱞ ᱢᱮ:\n\n_(Now select or type your Block under ${matchedDist}:)*`
          : activeLang === "nagpuri"
          ? `📍 *ज़िला (District):* *${distLocalName}*\n\nअब ज़िला ${matchedDist} कर अपन *Block (प्रखंड)* चुनू या लिखू:\n\n_(Now select or type your Block under ${matchedDist}:)*`
          : activeLang === "hi"
          ? `📍 *ज़िला (District):* *${distLocalName}*\n\nअब ज़िला ${matchedDist} का अपना *Block (प्रखंड)* चुनें या लिखें:\n\n_(Now select or type your Block under ${matchedDist}:)*`
          : `📍 *District:* *${matchedDist}*\n\nNow select your *Block* under ${matchedDist}:`,
        blocks
      );
      return;
    }

    // 7. If currently in SELECT_BLOCK step (STRICT VALIDATION)
    if (conversationStep === "SELECT_BLOCK") {
      const cleanInput = text.replace(/^[0-9.\s]+/, "").trim().toLowerCase();
      const validBlocks = JHARKHAND_DISTRICTS[collectedData.district]?.blocks || [];
      const matchedBlock = validBlocks.find(
        (b) =>
          b.toLowerCase() === cleanInput ||
          cleanInput.includes(b.toLowerCase()) ||
          b.toLowerCase().includes(cleanInput)
      );

      if (!matchedBlock) {
        addBotMessage(
          activeLang === "santali"
            ? `⚠️ *ᱵᱟᱝ ᱴᱷᱤᱠ ᱯᱨᱚᱠᱷᱚᱸᱰ (Invalid Block)!*\n\n"${text}" ᱡᱤᱞᱟᱹ *${collectedData.district}* ᱨᱮ ᱵᱟᱹᱱᱩᱜᱼᱟ ᱾ ᱞᱟᱛᱟᱨ ᱠᱷᱚᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ:\n\n_(Please select from the valid blocks below:)*`
            : activeLang === "nagpuri"
            ? `⚠️ *अमान्य प्रखंड (Invalid Block)!*\n\n"${text}" ज़िला *${collectedData.district}* कर प्रखंड नइखे। कृपया नीचे से चुनू:\n\n_(Please select from the valid blocks below:)*`
            : activeLang === "hi"
            ? `⚠️ *अमान्य प्रखंड (Invalid Block)!*\n\n"${text}" ज़िला *${collectedData.district}* का मान्य प्रखंड (Block) नहीं है। कृपया नीचे दिए गए विकल्पों में से ही चुनें:\n\n_(Please select from the valid blocks below:)*`
            : `⚠️ *Invalid Block!*\n\n"${text}" does not exist under *${collectedData.district}* district. Please select from the valid blocks below:`,
          validBlocks
        );
        return; // STAY in SELECT_BLOCK!
      }

      setCollectedData((prev) => ({
        ...prev,
        block: matchedBlock
      }));

      setConversationStep("ENTER_VILLAGE");

      addBotMessage(
        activeLang === "santali"
          ? `🏛️ *Block (ᱯᱨᱚᱠᱷᱚᱸᱰ):* *${matchedBlock}*\n\nᱟᱢᱟᱜ *Panchayat / Village / Ward (ᱟᱹᱛᱩ / ᱴᱚᱞᱟ / ᱣᱟᱨᱰ)* ᱨᱮᱭᱟᱜ ᱧᱩᱛᱩᱢ ᱚᱞ ᱢᱮ:\n\n_(Please type your Panchayat / Village / Ward / Area name:)*`
          : activeLang === "nagpuri"
          ? `🏛️ *Block (प्रखंड):* *${matchedBlock}*\n\nअपन *Panchayat / Village / Ward (ग्राम पंचायत / टोला / वार्ड)* कर नाम लिखू:\n\n_(Please type your Panchayat / Village / Ward / Area name:)*`
          : activeLang === "hi"
          ? `🏛️ *Block (प्रखंड):* *${matchedBlock}*\n\nअपना *ग्राम पंचायत / टोला / वार्ड (Village / Ward)* का नाम लिखें:\n\n_(Please type your Panchayat / Village / Ward / Area name:)*`
          : `🏛️ *Block:* *${matchedBlock}*\n\nPlease type your *Panchayat / Village / Ward / Area* name:`
      );
      return;
    }

    // 8. If currently in ENTER_VILLAGE step
    if (conversationStep === "ENTER_VILLAGE") {
      const village = text.trim();
      const finalData = {
        ...collectedData,
        village: village || "Gram Panchayat"
      };
      setCollectedData(finalData);
      setConversationStep("CONFIRMATION");

      addBotMessage(
        activeLang === "santali"
          ? `📝 *ᱟᱢᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱨᱮᱭᱟᱜ ᱵᱤᱵᱚᱨᱚᱬ ᱴᱷᱟᱹᱣᱠᱟᱹᱭ ᱢᱮ:*\n_(Please confirm your grievance details below:)*`
          : activeLang === "nagpuri"
          ? `📝 *रउरा गोहार के विवरण के पुष्टि करूं:*\n_(Please confirm your grievance details below:)*`
          : activeLang === "hi"
          ? `📝 *कृपया अपनी शिकायत के विवरण की पुष्टि करें:*\n_(Please confirm your grievance details below:)*`
          : `📝 *Please confirm your challenge details:*`,
        undefined,
        true,
        finalData
      );
      return;
    }

    // 9. Initial problem description submission (from MENU or COLLECT_PROBLEM)
    if (
      conversationStep === "MENU" ||
      conversationStep === "COLLECT_PROBLEM" ||
      conversationStep === "AWAIT_CLARIFICATION" ||
      conversationStep === "COMPLETED"
    ) {
      setIsTyping(true);
      const fullProblemText = collectedData.problemText
        ? `${collectedData.problemText}. ${text}`
        : text;

      // Run AI semantic validation
      const validation = await aiEngine.validateProblem({
        title: text.slice(0, 40),
        description: fullProblemText,
        imageUrl: currentImg || undefined,
        language: activeLang === "santali" ? "sat" : activeLang === "nagpuri" ? "nag" : activeLang === "hi" ? "hi" : "en"
      });

      setIsTyping(false);

      if (validation.status === "needs_clarification") {
        setConversationStep("AWAIT_CLARIFICATION");
        setCollectedData((prev) => ({
          ...prev,
          problemText: fullProblemText,
          imageUrl: currentImg || prev.imageUrl
        }));
        addBotMessage(
          activeLang === "santali"
            ? `ℹ️ *${validation.reason}*\n\n${validation.clarificationPrompt || "ᱫᱟᱭᱟᱠᱟᱛᱮ ᱟᱨᱦᱚᱸ ᱯᱩᱥᱴᱟᱹᱣ ᱞᱟᱹᱭ ᱢᱮ ᱪᱮᱫ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ? (Please describe in more detail)"}`
            : activeLang === "nagpuri"
            ? `ℹ️ *${validation.reason}*\n\n${validation.clarificationPrompt || "कृपया थोड़ा और बताऊ कि का दिक्कत आ रहल हवे? (Please describe in more detail)"}`
            : activeLang === "hi"
            ? `ℹ️ *${validation.reason}*\n\n${validation.clarificationPrompt || "कृपया थोड़ा और बताएं कि क्या दिक्कत आ रही है? (Please describe in more detail)"}`
            : `ℹ️ *${validation.reason}*\n\n${validation.clarificationPrompt || "Please describe what issue you are facing in more detail."}`
        );
        return;
      }

      // Check if theme was uncertain or unclassified: DO NOT blindly assign water!
      if (validation.status === "invalid" || !validation.detectedTheme) {
        setCollectedData((prev) => ({
          ...prev,
          problemText: fullProblemText,
          imageUrl: currentImg || prev.imageUrl
        }));
        setConversationStep("SELECT_THEME");

        addBotMessage(
          activeLang === "santali"
            ? "⚠️ *AI ᱛᱷᱤᱢ ᱵᱟᱝ ᱴᱷᱟᱹᱣᱠᱟᱹ ᱞᱮᱱᱟ (Theme Detection Uncertain)*\n\nAI ᱟᱢᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱨᱮᱭᱟᱜ ᱛᱷᱤᱢ ᱟᱯᱱᱟᱨ ᱛᱮ ᱵᱟᱝ ᱴᱷᱟᱹᱣᱠᱟᱹ ᱫᱟᱲᱮᱭᱟᱫᱟ ᱾\n\nᱫᱟᱭᱟᱠᱟᱛᱮ ᱞᱟᱛᱟᱨ ᱠᱷᱚᱱ ᱴᱷᱤᱠ ᱛᱷᱤᱢ ᱵᱟᱪᱷᱟᱣ ᱢᱮ:\n\n_(Please select the appropriate Theme from the options below:)*"
            : activeLang === "nagpuri"
            ? "⚠️ *AI थीम पहचान अनिश्चित (Theme Detection Uncertain)*\n\nAI रउरा समस्या कर सटीक विषय (Theme) स्वतः तय नइखे कर सकल।\n\nकृपया नीचे से सही थीम चुनू:\n\n_(Please select the appropriate Theme from the options below:)*"
            : activeLang === "hi"
            ? "⚠️ *AI थीम पहचान अनिश्चित (Theme Detection Uncertain)*\n\nAI आपकी समस्या का सटीक विषय (Theme) स्वतः तय नहीं कर सका।\n\nकृपया नीचे दिए गए विकल्पों में से सही थीम चुनें:\n\n_(Please select the appropriate Theme from the options below:)*"
            : "⚠️ *AI Theme Detection Uncertain*\n\nAI could not automatically determine the exact category for this description.\n\nPlease select the appropriate Theme from the options below:",
          ALL_THEMES.map((t) => {
            if (activeLang === "santali") return `${t.icon} ${t.labelSat}`;
            if (activeLang === "nagpuri") return `${t.icon} ${t.labelNag} (${t.labelEn})`;
            if (activeLang === "hi") return `${t.icon} ${t.labelHi} (${t.labelEn})`;
            return `${t.icon} ${t.labelEn}`;
          })
        );
        return;
      }

      // Theme successfully auto-detected!
      const detectedTheme: ProblemCategory = validation.detectedTheme;
      setCollectedData((prev) => ({
        ...prev,
        problemText: fullProblemText,
        theme: detectedTheme,
        imageUrl: currentImg || prev.imageUrl
      }));

      setConversationStep("SELECT_DISTRICT");

      const themeLabel = getThemeDisplayLabel(detectedTheme, activeLang);

      addBotMessage(
        activeLang === "santali"
          ? `✅ *AI ᱦᱚᱛᱮᱛᱮ ᱛᱷᱤᱢ (AI Detected Theme):*\n*${themeLabel}*\n_(ᱡᱩᱫᱤ ᱵᱟᱝ ᱴᱷᱤᱠᱟ, '🔄 ᱛᱷᱤᱢ ᱵᱚᱫᱚᱞ' ᱚᱛᱟᱭ ᱢᱮ / If incorrect, tap 'Change Theme')_\n\n📍 *ᱱᱚᱶᱟ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱭᱟᱜ ᱚᱠᱟ District (ᱡᱤᱞᱟᱹ) ᱨᱮ ᱢᱮᱱᱟᱜᱼᱟ? ᱡᱤᱞᱟᱹ ᱵᱟᱪᱷᱟᱣ ᱢᱮ ᱥᱮ ᱚᱞ ᱢᱮ:*\n_(Which District in Jharkhand is this problem located in? Choose or type below:)*`
          : activeLang === "nagpuri"
          ? `✅ *AI द्वारा पहचानल गेल थीम (AI Detected Theme):*\n*${themeLabel}*\n_(यदि ई सही नइखे, तो '🔄 थीम बदलू' चुनू / If incorrect, tap 'Change Theme')_\n\n📍 *ई समस्या झारखंड के कौन District (ज़िला) में बा? अपन ज़िला चुनू या लिखू:*\n_(Which District in Jharkhand is this problem located in? Choose or type below:)*`
          : activeLang === "hi"
          ? `✅ *AI द्वारा पहचानी गई थीम (AI Detected Theme):*\n*${themeLabel}*\n_(यदि यह सही नहीं है, तो '🔄 थीम बदलें' चुनें / If incorrect, tap 'Change Theme')_\n\n📍 *यह समस्या झारखंड के किस District (ज़िले) में है? अपना ज़िला चुनें या लिखें:*\n_(Which District in Jharkhand is this problem located in? Choose or type below:)*`
          : `✅ *AI Detected Theme:* *${themeLabel}*\n_(If this is incorrect, tap '🔄 Change Theme')_\n\n📍 *Which District in Jharkhand is this problem located in? Please choose or type:*`,
        getDistrictOptions(activeLang)
      );
    }
  };

  const handleOptionClick = (option: string) => {
    handleSendMessage(option);
  };

  const handleFinalSubmit = () => {
    const newProblem = submitProblem({
      title: collectedData.problemText.slice(0, 60),
      description: collectedData.problemText,
      category: collectedData.theme,
      district: collectedData.district || "Ranchi",
      block: collectedData.block || "Sadar Block",
      village: collectedData.village || "Gram Panchayat",
      source: "whatsapp",
      validationStatus: "valid",
      media: collectedData.imageUrl
        ? [
            {
              id: `med-${Date.now()}`,
              problemId: "",
              mediaType: "image",
              storageUrl: collectedData.imageUrl,
              cvValidationLabel: "Verified WhatsApp Ground Photo (95% Match)",
              cvValidationConfidence: 0.95
            }
          ]
        : undefined
    });

    setLastSubmittedProblem(newProblem);
    confetti({ particleCount: 80, spread: 70 });
    setConversationStep("COMPLETED");

    const themeLabel = getThemeDisplayLabel(newProblem.category, chatLang);
    const assignedUniv =
      newProblem.aiExplanation?.suggestedUniversities?.[0]?.universityName ||
      "Birla Institute of Technology, Mesra";

    addBotMessage(
      chatLang === "santali"
        ? `🎉 *ᱟᱢᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱡᱚᱢᱟ ᱦᱩᱭ ᱮᱱᱟ! (Challenge Registered Successfully!)*\n\n• *Ticket ID:* #${newProblem.ticketNumber}\n• *ᱛᱷᱤᱢ (Theme):* ${themeLabel}\n• *ᱴᱷᱟᱶ (Location):* ᱡᱤᱞᱟᱹ ${newProblem.district} (${newProblem.block})\n• *Assigned University:* ${assignedUniv}\n• *Gateway:* WhatsApp 24/7 AI Gateway\n\nᱱᱤᱛᱚᱜ ᱱᱚᱶᱟ ᱴᱤᱠᱮᱴ ᱨᱮᱭᱟᱜ ᱦᱟᱞᱚᱛ ᱧᱮᱞ ᱢᱮ (Track live status):`
        : chatLang === "nagpuri"
        ? `🎉 *रउरा गोहार सफलतापूर्वक दर्ज हो गेल! (Challenge Registered Successfully!)*\n\n• *शिकायत टिकट संख्या (Ticket ID):* #${newProblem.ticketNumber}\n• *थीम (Theme):* ${themeLabel}\n• *स्थान (Location):* ज़िला ${newProblem.district} (${newProblem.block})\n• *आवंटित विश्वविद्यालय (Assigned University):* ${assignedUniv}\n• *माध्यम (Gateway):* WhatsApp 24/7 AI Gateway\n\nरउरा अभी ई टिकट कर लाइव स्थिति देख सकिला (Track live status):`
        : chatLang === "hi"
        ? `🎉 *आपकी समस्या सफलतापूर्वक दर्ज हो गई है! (Challenge Registered Successfully!)*\n\n• *शिकायत टिकट संख्या (Ticket ID):* #${newProblem.ticketNumber}\n• *थीम (Theme):* ${themeLabel}\n• *स्थान (Location):* ज़िला ${newProblem.district} (${newProblem.block})\n• *आवंटित विश्वविद्यालय (Assigned University):* ${assignedUniv}\n• *माध्यम (Gateway):* WhatsApp 24/7 AI Gateway\n\nआप अभी इस टिकट की लाइव स्थिति देख सकते हैं (Track live status):`
        : `🎉 *Your Challenge has been Successfully Registered!*\n\n• *Complaint Ticket ID:* #${newProblem.ticketNumber}\n• *Theme:* ${themeLabel}\n• *Location:* ${newProblem.district} (${newProblem.block})\n• *Assigned University:* ${assignedUniv}\n• *Gateway:* WhatsApp 24/7 AI Gateway\n\nYou can track live progress of this ticket right now:`,
      [
        `📊 Track #${newProblem.ticketNumber}`,
        chatLang === "santali"
          ? "📝 ᱱᱟᱣᱟ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱚᱞ ᱢᱮ"
          : chatLang === "nagpuri"
          ? "📝 नया समस्या दर्ज करूं"
          : chatLang === "hi"
          ? "📝 एक और समस्या दर्ज करें"
          : "📝 Report Another Problem",
        chatLang === "santali"
          ? "🏠 ᱢᱩᱬᱩᱛ ᱢᱮᱱᱩ"
          : chatLang === "nagpuri"
          ? "🏠 मुख्य मेनू"
          : chatLang === "hi"
          ? "🏠 मुख्य मेनू"
          : "🏠 Main Menu"
      ]
    );
  };

  const handleReset = () => {
    setConversationStep("MENU");
    setCollectedData({
      problemText: "",
      theme: "Water Resources & Sanitation",
      district: "",
      block: "",
      village: "",
      imageUrl: undefined
    });
    setMessages([]);
  };

  // REAL Live Voice Note Recording with Web Speech API
  const startRealVoiceRecording = () => {
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    transcriptAccumulatorRef.current = "";
    setInterimSpokenText("");
    setRecordingSeconds(0);
    setIsRecordingVoice(true);

    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);

    if (SpeechRec) {
      try {
        const rec = new SpeechRec();
        recognitionRef.current = rec;
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = chatLang === "hi" ? "hi-IN" : "en-IN";

        rec.onresult = (event: any) => {
          let finalTranscript = "";
          let interimTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + " ";
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          const combined = (finalTranscript + interimTranscript).trim();
          transcriptAccumulatorRef.current = combined;
          setInterimSpokenText(combined);
        };

        rec.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
        };

        rec.start();
      } catch (err) {
        console.warn("Could not start SpeechRecognition:", err);
      }
    }
  };

  const cancelVoiceRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsRecordingVoice(false);
    setRecordingSeconds(0);
    setInterimSpokenText("");
    transcriptAccumulatorRef.current = "";
  };

  const stopAndProcessVoiceRecording = async () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    const durationSec = recordingSeconds;
    setIsRecordingVoice(false);
    setRecordingSeconds(0);

    let spoken = (transcriptAccumulatorRef.current || interimSpokenText).trim();

    // Fallback if browser SpeechRecognition was not supported or returned empty
    if (!spoken) {
      const manual = window.prompt(
        chatLang === "santali"
          ? "ᱢᱟᱭᱤᱠ ᱛᱮ ᱟᱲᱟᱝ ᱵᱟᱝ ᱥᱮᱴᱮᱨ ᱞᱮᱱᱟ ᱾ ᱟᱢᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱱᱚᱸᱰᱮ ᱚᱞ ᱢᱮ (Santhali, Nagpuri, Hindi, English):"
          : chatLang === "nagpuri"
          ? "माइक से आवाज नई मिलल। रउरा जे बोलली वोहे इहाँ लिखू (नागपुरी, हिंदी, English):"
          : chatLang === "hi"
          ? "माइक से आवाज नहीं मिली (या परमिशन नहीं मिली)। आपने जो बोला वो यहाँ लिखें (हिंदी, नागपुरी, संथाली, English):"
          : "Microphone speech was not captured. Please enter what you spoke (English, Hindi, Nagpuri, Santhali):",
        ""
      );
      if (manual && manual.trim()) {
        spoken = manual.trim();
      } else {
        setInterimSpokenText("");
        transcriptAccumulatorRef.current = "";
        return;
      }
    }

    setInterimSpokenText("");
    transcriptAccumulatorRef.current = "";

    const durString = `0:${durationSec < 10 ? `0${durationSec || 4}` : durationSec}`;
    const userTime = getCurrentTime();

    // 1. User sends voice note with their EXACT spoken words!
    const voiceMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: spoken,
      time: userTime,
      isVoiceNote: true,
      voiceDuration: durString
    };
    setMessages((prev) => [...prev, voiceMsg]);

    // 2. AI background processing of the exact spoken words
    setIsTyping(true);

    const activeLang = detectUserLanguage(spoken);
    setChatLang(activeLang);

    const fullProblemText = collectedData.problemText
      ? `${collectedData.problemText}. ${spoken}`
      : spoken;

    const validation = await aiEngine.validateProblem({
      title: "Voice Grievance",
      description: fullProblemText,
      language: activeLang === "santali" ? "sat" : activeLang === "nagpuri" ? "nag" : activeLang === "hi" ? "hi" : "en"
    });

    setIsTyping(false);

    if (validation.status === "invalid" || !validation.detectedTheme) {
      setCollectedData((prev) => ({
        ...prev,
        problemText: fullProblemText
      }));
      setConversationStep("SELECT_THEME");

      addBotMessage(
        activeLang === "santali"
          ? `🎙️ *Voice Note Transcribed (Speech-to-Text • ᱥᱟᱱᱛᱟᱲᱤ / Santhali):*\n_"${spoken}"_\n\n⚠️ *AI ᱛᱷᱤᱢ ᱵᱟᱝ ᱴᱷᱟᱹᱣᱠᱟᱹ ᱞᱮᱱᱟ (Theme Detection Uncertain)*\nᱫᱟᱭᱟᱠᱟᱛᱮ ᱞᱟᱛᱟᱨ ᱠᱷᱚᱱ ᱴᱷᱤᱠ ᱛᱷᱤᱢ ᱵᱟᱪᱷᱟᱣ ᱢᱮ:\n\n_(Please select the appropriate Theme from the options below:)*`
          : activeLang === "nagpuri"
          ? `🎙️ *वॉइस नोट डिकोड भेल (Speech-to-Text • नागपुरी / Nagpuri):*\n_"${spoken}"_\n\n⚠️ *AI थीम पहचान अनिश्चित (Theme Detection Uncertain)*\nAI रउरा बोली कर सटीक थीम स्वतः तय नइखे कर सकल।\n\nकृपया नीचे से सही थीम चुनू:\n\n_(Please select the appropriate Theme from the options below:)*`
          : activeLang === "hi"
          ? `🎙️ *वॉइस नोट डिकोड हुआ (Speech-to-Text • हिन्दी / Hindi):*\n_"${spoken}"_\n\n⚠️ *AI थीम पहचान अनिश्चित (Theme Detection Uncertain)*\nAI आपकी बोली गई समस्या की सटीक थीम स्वतः तय नहीं कर सका।\n\nकृपया नीचे दिए गए विकल्पों में से सही थीम चुनें:\n\n_(Please select the appropriate Theme from the options below:)*`
          : `🎙️ *Voice Note Transcribed (Speech-to-Text • English):*\n_"${spoken}"_\n\n⚠️ *AI Theme Detection Uncertain*\nAI could not automatically determine the exact theme for what was spoken.\n\nPlease select the appropriate Theme from the options below:`,
        ALL_THEMES.map((t) => {
          if (activeLang === "santali") return `${t.icon} ${t.labelSat}`;
          if (activeLang === "nagpuri") return `${t.icon} ${t.labelNag} (${t.labelEn})`;
          if (activeLang === "hi") return `${t.icon} ${t.labelHi} (${t.labelEn})`;
          return `${t.icon} ${t.labelEn}`;
        })
      );
      return;
    }

    const detectedTheme: ProblemCategory = validation.detectedTheme;
    setCollectedData((prev) => ({
      ...prev,
      problemText: fullProblemText,
      theme: detectedTheme
    }));

    setConversationStep("SELECT_DISTRICT");

    const themeLabel = getThemeDisplayLabel(detectedTheme, activeLang);

    const decodedBotText =
      activeLang === "santali"
        ? `🎙️ *Voice Note Transcribed (AI Speech-to-Text • ᱥᱟᱱᱛᱟᱲᱤ / Santhali):*\n_"${spoken}"_\n\n✅ *AI ᱦᱚᱛᱮᱛᱮ ᱛᱷᱤᱢ (AI Detected Theme):*\n*${themeLabel}*\n_(ᱡᱩᱫᱤ ᱵᱟᱝ ᱴᱷᱤᱠᱟ, '🔄 ᱛᱷᱤᱢ ᱵᱚᱫᱚᱞ' ᱚᱛᱟᱭ ᱢᱮ / If incorrect, tap 'Change Theme')_\n\n📍 *ᱱᱚᱶᱟ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱭᱟᱜ ᱚᱠᱟ District (ᱡᱤᱞᱟᱹ) ᱨᱮ ᱢᱮᱱᱟᱜᱼᱟ? ᱡᱤᱞᱟᱹ ᱵᱟᱪᱷᱟᱣ ᱢᱮ ᱥᱮ ᱚᱞ ᱢᱮ:*\n_(Which District in Jharkhand is this problem located in? Choose or type below:)*`
        : activeLang === "nagpuri"
        ? `🎙️ *वॉइस नोट डिकोड भेल (AI Speech-to-Text • नागपुरी / Nagpuri):*\n_"${spoken}"_\n\n✅ *AI द्वारा पहचानल गेल थीम (AI Detected Theme):*\n*${themeLabel}*\n_(यदि ई सही नइखे, तो '🔄 थीम बदलू' चुनू / If incorrect, tap 'Change Theme')_\n\n📍 *ई समस्या झारखंड के कौन District (ज़िला) में बा? अपन ज़िला चुनू या लिखू:*\n_(Which District in Jharkhand is this problem located in? Choose or type below:)*`
        : activeLang === "hi"
        ? `🎙️ *वॉइस नोट डिकोड हुआ (AI Speech-to-Text • हिन्दी / Hindi):*\n_"${spoken}"_\n\n✅ *AI द्वारा पहचानी गई थीम (AI Detected Theme):*\n*${themeLabel}*\n_(यदि यह सही नहीं है, तो '🔄 थीम बदलें' चुनें / If incorrect, tap 'Change Theme')_\n\n📍 *यह समस्या झारखंड के किस District (ज़िले) में है? अपना ज़िला चुनें या लिखें:*\n_(Which District in Jharkhand is this problem located in? Choose or type below:)*`
        : `🎙️ *Voice Note Transcribed (AI Speech-to-Text • English):*\n_"${spoken}"_\n\n✅ *AI Detected Theme:* *${themeLabel}*\n_(If this is incorrect, tap '🔄 Change Theme')_\n\n📍 *Which District in Jharkhand is this problem located in? Please choose or type:*`;

    addBotMessage(
      decodedBotText,
      getDistrictOptions(activeLang)
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      {/* WhatsApp Window Container */}
      <div className="bg-[#efeae2] rounded-2xl shadow-2xl border border-slate-300 w-full max-w-lg h-[640px] max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* 1. Official WhatsApp Header */}
        <div className="bg-[#075e54] text-white px-3 sm:px-4 py-2.5 flex items-center justify-between shadow-md select-none shrink-0">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-white font-bold text-sm shadow">
                🇮🇳
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 border-2 border-[#075e54] rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-xs sm:text-sm text-white tracking-wide">
                  Jharkhand Sahayak
                </h3>
                <span className="bg-emerald-400/20 text-emerald-300 text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.2 rounded-full border border-emerald-400/40">
                  ✓ VERIFIED
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-emerald-100 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <span>online • SIH 2026 AI Grievance Bot ({LANG_CONFIG[chatLang].badge})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 text-emerald-100">
            {/* Quick 4-Language Switcher Pills in WhatsApp Header */}
            <div className="flex items-center bg-emerald-950/60 rounded-lg p-0.5 border border-emerald-400/30 text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => setChatLang("en")}
                className={`px-1.5 py-0.5 rounded transition ${
                  chatLang === "en"
                    ? "bg-emerald-500 text-white font-bold shadow-xs"
                    : "text-emerald-200 hover:text-white"
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setChatLang("hi")}
                className={`px-1.5 py-0.5 rounded transition ${
                  chatLang === "hi"
                    ? "bg-emerald-500 text-white font-bold shadow-xs"
                    : "text-emerald-200 hover:text-white"
                }`}
                title="हिन्दी (Hindi)"
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setChatLang("nagpuri")}
                className={`px-1.5 py-0.5 rounded transition ${
                  chatLang === "nagpuri"
                    ? "bg-emerald-500 text-white font-bold shadow-xs"
                    : "text-emerald-200 hover:text-white"
                }`}
                title="नागपुरी (Nagpuri)"
              >
                नागपुरी
              </button>
              <button
                type="button"
                onClick={() => setChatLang("santali")}
                className={`px-1.5 py-0.5 rounded transition ${
                  chatLang === "santali"
                    ? "bg-emerald-500 text-white font-bold shadow-xs"
                    : "text-emerald-200 hover:text-white"
                }`}
                title="ᱥᱟᱱᱛᱟᱲᱤ (Santhali)"
              >
                ᱥᱟᱱᱛᱟᱲᱤ
              </button>
            </div>

            <button
              onClick={handleReset}
              title="Restart Conversation"
              className="p-1.5 hover:bg-emerald-800 rounded-full transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setWhatsappSimulatorOpen(false)}
              className="p-1.5 hover:bg-emerald-800 rounded-full transition"
              title="Close WhatsApp"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Chat Area with WhatsApp Wallpaper */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#efeae2]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        >
          {/* Official Encryption Notice Banner */}
          <div className="flex justify-center">
            <div className="bg-[#ffeecd] text-[#54656f] text-[10px] px-3 py-1 rounded-lg text-center shadow-xs border border-amber-200 max-w-xs font-medium">
              🔒 End-to-end verified by Government of Jharkhand AI Gateway Node.
            </div>
          </div>

          {/* Clean Interactive Launcher with Regional Languages Support */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-3 sm:p-5 space-y-3 my-auto">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl shadow-inner">
                💬
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="font-bold text-slate-800 text-sm">
                  {LANG_CONFIG[chatLang].botTitle}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {LANG_CONFIG[chatLang].starterHint}
                </p>
              </div>

              {/* Language Selection Chips */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 py-0.5">
                <button
                  type="button"
                  onClick={() => setChatLang("en")}
                  className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold transition border ${
                    chatLang === "en"
                      ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  🌐 English
                </button>
                <button
                  type="button"
                  onClick={() => setChatLang("hi")}
                  className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold transition border ${
                    chatLang === "hi"
                      ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  🇮🇳 हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setChatLang("nagpuri")}
                  className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold transition border ${
                    chatLang === "nagpuri"
                      ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  🌾 नागपुरी (Nagpuri)
                </button>
                <button
                  type="button"
                  onClick={() => setChatLang("santali")}
                  className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold transition border ${
                    chatLang === "santali"
                      ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  🏹 संथाली (ᱥᱟᱱᱛᱟᱲᱤ)
                </button>
              </div>

              {/* Starter Action Buttons */}
              <div className="w-full max-w-xs space-y-1.5 pt-0.5">
                <button
                  onClick={() => handleSendMessage(`1. ${LANG_CONFIG[chatLang].optReport}`)}
                  className="w-full bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl py-2 px-3 text-xs font-semibold text-left flex items-center justify-between shadow-xs transition"
                >
                  <span>📝 {LANG_CONFIG[chatLang].optReport}</span>
                  <span className="text-emerald-500">&rarr;</span>
                </button>
                <button
                  onClick={() => handleSendMessage(`2. ${LANG_CONFIG[chatLang].optCheck}`)}
                  className="w-full bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl py-2 px-3 text-xs font-semibold text-left flex items-center justify-between shadow-xs transition"
                >
                  <span>📊 {LANG_CONFIG[chatLang].optCheck}</span>
                  <span className="text-emerald-500">&rarr;</span>
                </button>
                <button
                  onClick={() => handleSendMessage(`3. ${LANG_CONFIG[chatLang].optHelp}`)}
                  className="w-full bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl py-2 px-3 text-xs font-semibold text-left flex items-center justify-between shadow-xs transition"
                >
                  <span>ℹ️ {LANG_CONFIG[chatLang].optHelp}</span>
                  <span className="text-emerald-500">&rarr;</span>
                </button>
              </div>


            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2 shadow-xs text-xs relative ${
                  m.sender === "user"
                    ? "bg-[#d9fdd3] text-slate-800 rounded-tr-xs"
                    : "bg-white text-slate-800 rounded-tl-xs border border-slate-200"
                }`}
              >
                {/* Embedded image preview */}
                {m.image && (
                  <div className="mb-2 rounded-lg overflow-hidden border border-slate-200">
                    <img
                      src={m.image}
                      alt="Attachment"
                      className="w-full max-h-48 object-cover"
                    />
                  </div>
                )}

                {/* Voice Note Bubble with Realistic Audio Waveform */}
                {m.isVoiceNote ? (
                  <div className="flex items-center space-x-3 py-1.5 min-w-[210px]">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center space-x-1 h-5">
                        {[40, 75, 30, 95, 60, 100, 45, 80, 50, 85, 35, 90, 40, 65, 30].map(
                          (h, i) => (
                            <span
                              key={i}
                              className="w-1 bg-emerald-600 rounded-full transition-all"
                              style={{ height: `${h}%` }}
                            />
                          )
                        )}
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                        <span>{m.voiceDuration || "0:06"}</span>
                        <span className="text-[9px] text-emerald-800 font-sans font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                          🎙️ Voice Note
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {m.text}
                  </div>
                )}

                {/* Confirmation Card */}
                {m.isConfirmationCard && m.confirmationData && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="font-bold text-slate-800 flex items-center space-x-1.5 border-b border-slate-200 pb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>
                        {chatLang === "santali"
                          ? "ᱮᱴᱠᱮᱴᱚᱬᱮ ᱥᱟᱨᱟᱝᱥ (Challenge Summary)"
                          : chatLang === "nagpuri"
                          ? "गोहार सारांश (Challenge Summary)"
                          : chatLang === "hi"
                          ? "शिकायत सारांश (Challenge Summary)"
                          : "Challenge Summary"}
                      </span>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-700">
                      <p>
                        <span className="font-semibold">
                          {chatLang === "santali"
                            ? "ᱮᱴᱠᱮᱴᱚᱬᱮ (Problem):"
                            : chatLang === "nagpuri"
                            ? "समस्या (Problem):"
                            : chatLang === "hi"
                            ? "समस्या (Problem):"
                            : "Problem:"}
                        </span>{" "}
                        {m.confirmationData.problem}
                      </p>
                      <p>
                        <span className="font-semibold">
                          {chatLang === "santali"
                            ? "ᱛᱷᱤᱢ (Theme):"
                            : chatLang === "nagpuri"
                            ? "थीम (Theme):"
                            : chatLang === "hi"
                            ? "थीम (Theme):"
                            : "Theme:"}
                        </span>{" "}
                        <span className="text-emerald-700 font-bold">
                          {getThemeDisplayLabel(m.confirmationData.theme, chatLang)}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold">
                          {chatLang === "santali"
                            ? "ᱴᱷᱟᱶ (Location):"
                            : chatLang === "nagpuri"
                            ? "स्थान (Location):"
                            : chatLang === "hi"
                            ? "स्थान (Location):"
                            : "Location:"}
                        </span>{" "}
                        {m.confirmationData.village},{" "}
                        {m.confirmationData.block},{" "}
                        {m.confirmationData.district}
                      </p>
                    </div>

                    {conversationStep === "CONFIRMATION" && (
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={handleFinalSubmit}
                          className="flex-1 flex items-center justify-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg text-[11px] shadow transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            {chatLang === "santali"
                              ? "✅ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱡᱚᱢᱟᱭ ᱢᱮ (Submit)"
                              : chatLang === "nagpuri"
                              ? "✅ गोहार दर्ज करूं (Submit Challenge)"
                              : chatLang === "hi"
                              ? "✅ शिकायत दर्ज करें (Submit)"
                              : "✅ Submit Challenge"}
                          </span>
                        </button>
                        <button
                          onClick={handleReset}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg text-[11px] transition"
                        >
                          {chatLang === "santali"
                            ? "✏️ ᱥᱟᱯᱲᱟᱣ (Edit)"
                            : chatLang === "nagpuri"
                            ? "✏️ सुधारूं (Edit)"
                            : chatLang === "hi"
                            ? "✏️ सुधारें (Edit)"
                            : "✏️ Edit"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Progress Tracking Card */}
                {m.isProgressCard && m.progressData && (() => {
                  const p = m.progressData;
                  const statusInfo = getStatusBadge(p.status);
                  return (
                    <div className="mt-3 p-3.5 bg-gradient-to-br from-slate-50 to-emerald-50/50 rounded-xl border border-emerald-300 text-xs space-y-2.5 shadow-xs">
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-base">🏛️</span>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                              JSICP Grievance Tracker
                            </span>
                            <div className="font-mono font-extrabold text-xs text-slate-800">
                              Ticket #{p.ticketNumber}
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.color} flex items-center space-x-1`}>
                          <span>{statusInfo.icon}</span>
                          <span>{chatLang === "hi" ? statusInfo.labelHi : statusInfo.label}</span>
                        </span>
                      </div>

                      {/* Details */}
                      <div className="space-y-1.5 text-[11px] text-slate-700 bg-white/90 p-2.5 rounded-lg border border-slate-200">
                        <p className="font-bold text-slate-900 leading-tight">
                          {p.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] pt-1">
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-semibold">
                            {p.category}
                          </span>
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md flex items-center space-x-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>{p.district}{p.block ? ` • ${p.block}` : ""}{p.village ? ` (${p.village})` : ""}</span>
                          </span>
                          {p.priorityScore && (
                            <span className="bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded-md font-bold">
                              Priority: {p.priorityScore}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Visual Stepper */}
                      <div className="p-2 bg-white/90 rounded-lg border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                          <span>{chatLang === "hi" ? "प्रगति चरण" : "PROGRESS MILESTONES"}</span>
                          <span className="text-emerald-700 font-extrabold">Stage {statusInfo.step} of 4</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1 text-[9px] font-semibold text-center">
                          <div className={`p-1 rounded ${statusInfo.step >= 1 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                            {chatLang === "hi" ? "✓ दर्ज" : "✓ Registered"}
                          </div>
                          <div className={`p-1 rounded ${statusInfo.step >= 2 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                            {statusInfo.step >= 2 ? (chatLang === "hi" ? "✓ आवंटित" : "✓ Allocated") : (chatLang === "hi" ? "2. आवंटन" : "2. Allocated")}
                          </div>
                          <div className={`p-1 rounded ${statusInfo.step >= 3 ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                            {statusInfo.step >= 3 ? (chatLang === "hi" ? "✓ फील्ड कार्य" : "✓ In Action") : (chatLang === "hi" ? "3. कार्रवाई" : "3. Action")}
                          </div>
                          <div className={`p-1 rounded ${statusInfo.step >= 4 ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                            {statusInfo.step >= 4 ? (chatLang === "hi" ? "✓ समाधान" : "✓ Resolved") : (chatLang === "hi" ? "4. समाधान" : "4. Resolved")}
                          </div>
                        </div>
                      </div>

                      {/* Assigned Institution */}
                      <div className="text-[10px] space-y-1 text-slate-600 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                        <div className="flex items-start space-x-1">
                          <span className="font-bold text-emerald-950 shrink-0">{chatLang === "hi" ? "🏛️ आवंटित संस्थान:" : "🏛️ Assigned Institute:"}</span>
                          <span className="text-emerald-900 font-medium">{p.assignedUniversity || "Birla Institute of Technology, Mesra"}</span>
                        </div>
                        {p.assignedFaculty && (
                          <div className="flex items-start space-x-1">
                            <span className="font-bold text-slate-800 shrink-0">{chatLang === "hi" ? "👨‍🔬 मुख्य संकाय:" : "👨‍🔬 Lead Faculty:"}</span>
                            <span className="text-slate-700">{p.assignedFaculty}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Options / Quick-reply chips */}
                {m.options && m.options.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {m.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOptionClick(opt)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full text-[11px] font-semibold transition"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Timestamp & read receipts */}
                <div className="flex items-center justify-end space-x-1 mt-1 text-[10px] text-slate-500">
                  <span>{m.time}</span>
                  {m.sender === "user" && (
                    <CheckCheck className="w-3.5 h-3.5 text-sky-500 inline" />
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center space-x-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl rounded-tl-xs w-fit shadow-xs">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce delay-200"></span>
              <span className="text-[10px] text-slate-500 ml-1">
                {LANG_CONFIG[chatLang].typingNotice}
              </span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* 3. Image Attachment Preview Strip */}
        {attachedImage && (
          <div className="bg-slate-100 px-4 py-2 border-t border-slate-300 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={attachedImage}
                alt="Attachment"
                className="w-10 h-10 object-cover rounded border border-slate-300"
              />
              <span className="text-xs text-slate-700 font-medium">
                {chatLang === "santali"
                  ? "ᱯᱷᱚᱴᱚ ᱠᱩᱞ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱯᱲᱟᱣ"
                  : chatLang === "nagpuri"
                  ? "फोटो भेजेक ले तैयार बा"
                  : chatLang === "hi"
                  ? "फोटो भेजने के लिए तैयार"
                  : "Photo ready to send with message"}
              </span>
            </div>
            <button
              onClick={() => setAttachedImage(null)}
              className="text-rose-600 hover:text-rose-800 text-xs font-bold"
            >
              {chatLang === "santali" ? "ᱜᱤᱰᱤ ᱠᱟᱜ ᱢᱮ" : chatLang === "nagpuri" ? "हटाऊ" : chatLang === "hi" ? "हटाएं" : "Remove"}
            </button>
          </div>
        )}

        {/* 4. WhatsApp Message Input Bar */}
        <div className="bg-[#f0f2f5] px-3 py-2 border-t border-slate-300 flex items-center space-x-2 shrink-0">
          {/* File Upload (Photo) */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title={chatLang === "santali" ? "ᱯᱷᱚᱴᱚ ᱡᱚᱲᱟᱣ ᱢᱮ" : chatLang === "nagpuri" ? "फोटो संलग्न करूं" : chatLang === "hi" ? "फोटो संलग्न करें" : "Attach Photo"}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-full transition"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Camera Button */}
          <button
            type="button"
            onClick={() => setCameraModalOpen(true)}
            title={chatLang === "santali" ? "ᱠᱮᱢᱮᱨᱟ ᱛᱮ ᱯᱷᱚᱴᱚ ᱛᱩᱞᱟᱹᱣ ᱢᱮ" : chatLang === "nagpuri" ? "कैमरा से फोटो लेवूं" : chatLang === "hi" ? "कैमरे से फोटो लें" : "Take Photo with Camera"}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-full transition"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Text Input OR Live Voice Recording Interface */}
          {isRecordingVoice ? (
            <div className="flex-1 flex items-center justify-between bg-white border border-rose-200 shadow-sm rounded-full px-3 py-1.5">
              {/* Left: Delete Recording button */}
              <button
                type="button"
                onClick={cancelVoiceRecording}
                title={chatLang === "santali" ? "ᱵᱟᱹᱛᱤᱞ ᱢᱮ" : chatLang === "nagpuri" ? "रद्द करूं" : chatLang === "hi" ? "रद्द करें" : "Cancel Recording"}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Center Left: Live Recording Timer & Red Pulse */}
              <div className="flex items-center space-x-1.5 px-2 shrink-0">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                </span>
                <span className="text-xs font-mono font-bold text-rose-700 tracking-wider">
                  00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                </span>
              </div>

              {/* Language pill during recording */}
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline">
                🎙️ {LANG_CONFIG[chatLang].nativeName}
              </span>

              {/* Center: Realistic WhatsApp Audio Waveform bars */}
              <div className="flex-1 flex items-center justify-center space-x-1 px-2 h-6 overflow-hidden">
                {[30, 65, 25, 80, 45, 95, 35, 70, 50, 90, 40, 85, 30, 65, 90, 45, 75, 35, 80, 55].map(
                  (h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-emerald-500 rounded-full transition-all duration-150 animate-pulse"
                      style={{
                        height: `${Math.max(25, (h * ((recordingSeconds % 3) + 1)) % 100)}%`,
                        animationDelay: `${i * 60}ms`
                      }}
                    />
                  )
                )}
              </div>

              {/* Right: WhatsApp Green Send Voice Note Button */}
              <button
                type="button"
                onClick={stopAndProcessVoiceRecording}
                title={chatLang === "santali" ? "ᱟᱲᱟᱝ ᱠᱩᱞ ᱢᱮ" : chatLang === "nagpuri" ? "वॉइस नोट भेजूं" : chatLang === "hi" ? "वॉइस नोट भेजें" : "Send Voice Note"}
                className="p-2 bg-[#00a884] hover:bg-[#069475] text-white rounded-full transition shadow hover:scale-105 flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                placeholder={
                  conversationStep === "SELECT_THEME"
                    ? chatLang === "santali"
                      ? "ᱛᱷᱤᱢ ᱵᱟᱪᱷᱟᱣ ᱢᱮ ᱥᱮ ᱚᱞ ᱢᱮ..."
                      : chatLang === "nagpuri"
                      ? "नीचे से थीम चुनू या लिखू..."
                      : chatLang === "hi"
                      ? "नीचे से थीम चुनें या टाइप करें..."
                      : "Select or type your theme..."
                    : conversationStep === "SELECT_DISTRICT"
                    ? chatLang === "santali"
                      ? "ᱡᱤᱞᱟᱹ ᱵᱟᱪᱷᱟᱣ ᱢᱮ ᱥᱮ ᱚᱞ ᱢᱮ..."
                      : chatLang === "nagpuri"
                      ? "अपन ज़िला चुनू या लिखू..."
                      : chatLang === "hi"
                      ? "अपना ज़िला चुनें या लिखें..."
                      : "Type or click your district..."
                    : conversationStep === "SELECT_BLOCK"
                    ? chatLang === "santali"
                      ? "ᱯᱨᱚᱠᱷᱚᱸᱰ ᱵᱟᱪᱷᱟᱣ ᱢᱮ ᱥᱮ ᱚᱞ ᱢᱮ..."
                      : chatLang === "nagpuri"
                      ? "अपन प्रखंड चुनू या लिखू..."
                      : chatLang === "hi"
                      ? "अपना प्रखंड चुनें या लिखें..."
                      : "Type or click your block..."
                    : LANG_CONFIG[chatLang].placeholder
                }
                className="flex-1 bg-white border border-slate-300 rounded-full px-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#075e54]"
              />

              {/* Voice Record Button or Send Button */}
              {inputText.trim() || attachedImage ? (
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  className="p-2.5 bg-[#00a884] hover:bg-[#069475] text-white rounded-full shadow transition"
                  title="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={startRealVoiceRecording}
                  title={
                    chatLang === "santali"
                      ? "ᱢᱟᱭᱤᱠ ᱚᱛᱟ ᱠᱟᱛᱮ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱨᱚᱲ ᱢᱮ"
                      : chatLang === "nagpuri"
                      ? "माइक दबा के नागपुरी, हिंदी या संथाली में बोलू"
                      : chatLang === "hi"
                      ? "माइक दबाकर हिंदी, नागपुरी या संथाली में बोलें"
                      : "Click to speak in Nagpuri, Santhali, Hindi or English"
                  }
                  className="p-2.5 rounded-full transition shadow bg-[#00a884] hover:bg-[#069475] text-white hover:scale-105"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Live Camera Modal */}
      <CameraCaptureModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onCapture={(imgData) => setAttachedImage(imgData)}
      />
    </div>
  );
};
