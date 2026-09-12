import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User as UserIcon,
  Search,
  HelpCircle,
  FileText,
  Building,
  CheckCircle2,
  Mic
} from "lucide-react";
import { aiEngine } from "../../services/aiEngine";

export const JharkhandSahayakChatbot: React.FC = () => {
  const { chatbotOpen, setChatbotOpen, problems, currentUser } = useApp();
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<
    { sender: "bot" | "user"; text: string; timestamp: string; actionLink?: string }[]
  >([
    {
      sender: "bot",
      text: `Namaskar ${currentUser.fullName}! I am Jharkhand Sahayak AI, your 24/7 societal innovation assistant. How can I help you today? You can ask about submitting a problem, tracking a ticket, university proposals, or CSR funding.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatbotOpen]);

  if (!chatbotOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      sender: "user" as const,
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");

    setTimeout(async () => {
      let botReply = "";
      const lower = query.toLowerCase();

      const ticketMatch = query.match(/JSICP-2026-\d{4}/i);
      if (ticketMatch) {
        const ticketId = ticketMatch[0].toUpperCase();
        const found = problems.find((p) => p.ticketNumber === ticketId);
        if (found) {
          botReply = `🔎 Ticket Found: "${found.title}"\n• Status: ${found.status.toUpperCase()}\n• District: ${found.district}\n• Assigned HEI: ${found.assignedUniversityName || "Under Nodal Review"}\n• Priority Score: ${found.priorityScore}/100`;
        } else {
          botReply = `I searched the database for ticket ${ticketId}, but could not find a match. Please ensure the ticket number is correct (e.g., JSICP-2026-0841).`;
        }
      } else if (lower.includes("submit") || lower.includes("how to file") || lower.includes("register problem")) {
        botReply = "To submit a societal challenge, click Submit Challenge in the top bar. You can upload photos/videos, record voice in Hindi/Nagpuri/Santali, and your GPS location will be auto-tagged for district officials.";
      } else if (lower.includes("csr") || lower.includes("funding") || lower.includes("industry")) {
        botReply = "Industry partners and CSR Foundations can browse verified university solution proposals on the Industry Marketplace. You can fund prototypes, provide lab equipment, or sign MoUs digitally with blockchain timestamping.";
      } else if (lower.includes("university") || lower.includes("hei") || lower.includes("mentor") || lower.includes("team")) {
        botReply = "Universities (BIT Mesra, IIT ISM Dhanbad, NIT Jamshedpur, BAU, etc.) receive AI-routed problems matched to their research domains. Nodal officers accept challenges and assign faculty mentors to form multidisciplinary student teams.";
      } else if (lower.includes("status") || lower.includes("track")) {
        const myProb = problems.find((p) => p.submittedBy === currentUser.id) || problems[0];
        botReply = `Your latest submitted challenge "${myProb.title}" is currently in status: [${myProb.status.toUpperCase()}]. Track all updates in the My Challenges tab.`;
        // Dynamic response from JSICP AI assistant
        const reply = await aiEngine.askChatbot(query);
        botReply = `🤖 ${reply}`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm">Jharkhand Sahayak AI</h3>
            <span className="text-[10px] text-emerald-200 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
              <span>Civic Assistant • Multilingual</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => setChatbotOpen(false)}
          className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2 ${
              m.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                m.sender === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-white"
              }`}
            >
              {m.sender === "user" ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                m.sender === "user"
                  ? "bg-emerald-600 text-white rounded-tr-none shadow-sm"
                  : "bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm"
              }`}
            >
              <p className="whitespace-pre-line">{m.text}</p>
              <span
                className={`text-[9px] block mt-1 ${
                  m.sender === "user" ? "text-emerald-200 text-right" : "text-slate-400"
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto text-[11px]">
        <button
          onClick={() => handleSend("Track ticket JSICP-2026-0841")}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition"
        >
          Track #0841
        </button>
        <button
          onClick={() => handleSend("How to submit a civic problem?")}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition"
        >
          How to submit?
        </button>
        <button
          onClick={() => handleSend("Tell me about CSR funding")}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition"
        >
          CSR Funding
        </button>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask a question or enter Ticket ID..."
          className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
