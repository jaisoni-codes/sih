import React, { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

interface VoiceInputButtonProps {
  onTranscript: (text: string, detectedLang: string) => void;
  language?: string;
  fieldLabel?: string;
  className?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  language = "hi",
  fieldLabel = "field",
  className = ""
}) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback prompt if browser speech recognition is unavailable
      const simulatedText =
        language === "hi"
          ? "हमारे गांव में पिछले 3 दिनों से पानी की सप्लाई नहीं आ रही है और लोग परेशान हैं।"
          : "Water supply in our village has been stopped for 3 days and villagers are suffering.";
      const promptText = window.prompt(
        `Web Speech API not supported in this browser. Enter spoken text for ${fieldLabel}:`,
        simulatedText
      );
      if (promptText) {
        onTranscript(promptText, language === "hi" ? "hi-IN" : "en-IN");
      }
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;

      // Choose dialect based on current portal language
      if (language === "hi" || language === "nagpuri") {
        recognition.lang = "hi-IN";
      } else {
        recognition.lang = "en-IN";
      }

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        if (event.results && event.results[0]) {
          const transcript = event.results[0][0].transcript;
          const detectedLang = recognition.lang;
          onTranscript(transcript, detectedLang);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech recognition init failed:", err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={isListening ? stopListening : startListening}
      title={isListening ? "Stop voice listening" : `Click to speak ${fieldLabel}`}
      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
        isListening
          ? "bg-rose-500 text-white shadow-md shadow-rose-500/30 animate-pulse"
          : "bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200"
      } ${className}`}
    >
      {isListening ? (
        <>
          <Square className="w-3 h-3 text-white fill-current" />
          <span>Listening...</span>
        </>
      ) : (
        <>
          <Mic className="w-3.5 h-3.5 text-emerald-600" />
          <span>🎙 Voice</span>
        </>
      )}
    </button>
  );
};
