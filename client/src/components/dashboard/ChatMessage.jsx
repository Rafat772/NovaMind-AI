import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  User,
  FileText,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Languages,
  Loader2,
  RotateCcw,
  Globe,
} from "lucide-react";
import { speakText, stopSpeech } from "../../utils/speechUtils";
import MarkdownRenderer from "../common/MarkdownRenderer";
import chatService from "../../services/chatService";

const SUPPORTED_LANGUAGES = [
  { code: "hi-IN", name: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "ur-PK", name: "Urdu", native: "اردو", flag: "🇵🇰" },
  { code: "es-ES", name: "Spanish", native: "Español", flag: "🇪🇸" },
  { code: "fr-FR", name: "French", native: "Français", flag: "🇫🇷" },
  { code: "de-DE", name: "German", native: "Deutsch", flag: "🇩🇪" },
  { code: "ar-SA", name: "Arabic", native: "العربية", flag: "🇸🇦" },
  { code: "ja-JP", name: "Japanese", native: "日本語", flag: "🇯🇵" },
  { code: "zh-CN", name: "Chinese", native: "中文", flag: "🇨🇳" },
  { code: "ru-RU", name: "Russian", native: "Русский", flag: "🇷🇺" },
  { code: "pt-BR", name: "Portuguese", native: "Português", flag: "🇧🇷" },
];

function ChatMessage({ role, message, content, citations = [] }) {
  const isUser = role === "user";
  const textContent = content || message || "";

  const [showCitations, setShowCitations] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Multi-Language Translation State
  const [translations, setTranslations] = useState({});
  const [activeLang, setActiveLang] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [translationError, setTranslationError] = useState(null);

  const langMenuRef = useRef(null);

  // Text currently being displayed (original vs translated)
  const displayedText = activeLang && translations[activeLang.name]
    ? translations[activeLang.name]
    : textContent;

  // Close language menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setShowLangMenu(false);
      }
    }
    if (showLangMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLangMenu]);

  // Stop speech if message unmounts
  useEffect(() => {
    return () => {
      if (isPlaying) stopSpeech();
    };
  }, [isPlaying]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeech = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      speakText(displayedText, {
        lang: activeLang ? activeLang.code : "en-US",
        onStart: () => setIsPlaying(true),
        onEnd: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      });
    }
  };

  const handleSelectLanguage = async (lang) => {
    setShowLangMenu(false);
    setTranslationError(null);

    // If cached in state, switch instantly
    if (translations[lang.name]) {
      setActiveLang(lang);
      if (isPlaying) stopSpeech();
      return;
    }

    try {
      setIsTranslating(true);
      const res = await chatService.translateMessage({
        text: textContent,
        target_language: lang.name,
      });

      if (res && res.translated_text) {
        setTranslations((prev) => ({
          ...prev,
          [lang.name]: res.translated_text,
        }));
        setActiveLang(lang);
        if (isPlaying) stopSpeech();
      }
    } catch (err) {
      console.error("Translation failed:", err);
      setTranslationError("Translation failed. Please try again.");
      setTimeout(() => setTranslationError(null), 3500);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleResetOriginal = () => {
    setActiveLang(null);
    if (isPlaying) stopSpeech();
  };

  return (
    <div
      className={`flex gap-3 mb-6 animate-in fade-in ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-600/30 text-white mt-0.5">
          <Sparkles size={18} />
        </div>
      )}

      {/* Message Container */}
      <div
        className={`max-w-2xl sm:max-w-3xl flex flex-col ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-5 py-4 rounded-3xl transition-all duration-200 ${
            isUser
              ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-br-sm shadow-lg shadow-purple-600/20 text-sm leading-relaxed"
              : "bg-[#14141E] text-gray-200 rounded-tl-sm border border-[#2D2D38] shadow-xl w-full"
          }`}
        >
          {/* Active Translation Indicator Bar */}
          {!isUser && activeLang && (
            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#252535] text-xs">
              <div className="flex items-center gap-2 text-purple-300 font-medium">
                <Globe size={13} className="text-purple-400" />
                <span>
                  Translated to {activeLang.flag} {activeLang.name} ({activeLang.native})
                </span>
              </div>
              <button
                type="button"
                onClick={handleResetOriginal}
                className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-white px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                title="Return to original English text"
              >
                <RotateCcw size={11} />
                <span>Original</span>
              </button>
            </div>
          )}

          {/* Translation Error alert */}
          {!isUser && translationError && (
            <div className="mb-3 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-800/60 text-red-300 text-xs">
              {translationError}
            </div>
          )}

          {/* Content */}
          {isUser ? (
            <p className="whitespace-pre-wrap">{textContent}</p>
          ) : (
            <MarkdownRenderer content={displayedText} />
          )}

          {/* Citations section for Assistant */}
          {!isUser && citations && citations.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#252535]">
              <button
                type="button"
                onClick={() => setShowCitations(!showCitations)}
                className="flex items-center gap-2 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
              >
                <FileText size={14} />
                <span>
                  {citations.length} Grounded Research Source
                  {citations.length > 1 ? "s" : ""}
                </span>
                {showCitations ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showCitations && (
                <div className="mt-3 space-y-2 animate-in fade-in duration-150">
                  {citations.map((c, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#0D0D14] border border-[#232332] text-xs text-gray-300"
                    >
                      <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                        <span className="font-semibold text-white truncate max-w-[200px]">
                          {c.filename}
                        </span>
                        <div className="flex items-center gap-2">
                          {c.page_number && (
                            <span className="px-1.5 py-0.5 rounded bg-white/5 text-gray-400">
                              Page {c.page_number}
                            </span>
                          )}
                          <span className="text-purple-400 font-bold">
                            {Math.round((c.score || 0) * 100)}% Match
                          </span>
                        </div>
                      </div>
                      <p className="font-mono text-gray-400 text-[11px] leading-relaxed line-clamp-2">
                        "{c.snippet}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions row below assistant message */}
        {!isUser && (
          <div className="relative flex items-center gap-3 mt-1.5 ml-2 text-xs text-gray-500">
            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 hover:text-purple-400 transition-colors cursor-pointer"
              title="Copy response to clipboard"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-green-400" />
                  <span className="text-green-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>

            <span className="text-gray-700">•</span>

            {/* Read Aloud / Audio Playback button */}
            <button
              type="button"
              onClick={handleToggleSpeech}
              title={isPlaying ? "Stop speech" : "Read aloud with text-to-speech"}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                isPlaying
                  ? "text-purple-400 font-semibold"
                  : "hover:text-purple-400"
              }`}
            >
              {isPlaying ? (
                <>
                  <VolumeX size={13} className="text-red-400" />
                  <span className="text-purple-300">Stop</span>
                  {/* Animated equalizer bars */}
                  <span className="inline-flex items-center gap-0.5 ml-1">
                    <span className="w-1 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1 h-3.5 bg-fuchsia-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                  </span>
                </>
              ) : (
                <>
                  <Volume2 size={13} />
                  <span>Listen</span>
                </>
              )}
            </button>

            <span className="text-gray-700">•</span>

            {/* Translate Button & Menu Container */}
            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                onClick={() => setShowLangMenu((prev) => !prev)}
                disabled={isTranslating}
                title="Translate response into multiple languages"
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeLang
                    ? "text-purple-400 font-medium"
                    : "hover:text-purple-400"
                }`}
              >
                {isTranslating ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-purple-400" />
                    <span className="text-purple-300">Translating...</span>
                  </>
                ) : (
                  <>
                    <Languages size={13} />
                    <span>
                      {activeLang ? `${activeLang.flag} ${activeLang.name}` : "Translate"}
                    </span>
                    <ChevronDown size={11} className={`transition-transform duration-150 ${showLangMenu ? "rotate-180" : ""}`} />
                  </>
                )}
              </button>

              {/* Translation Dropdown Menu */}
              {showLangMenu && (
                <div className="absolute left-0 bottom-full mb-2 z-50 w-56 rounded-2xl bg-[#12121B] border border-[#2B2B3C] shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl">
                  <div className="px-2.5 py-1.5 mb-1 border-b border-[#222232] flex items-center justify-between text-[11px] text-gray-400 font-semibold">
                    <span>Translate Response</span>
                    <Globe size={12} className="text-purple-400" />
                  </div>

                  {/* Reset to English item if currently translated */}
                  {activeLang && (
                    <button
                      type="button"
                      onClick={() => {
                        handleResetOriginal();
                        setShowLangMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-purple-300 hover:bg-purple-600/15 transition-colors cursor-pointer mb-1"
                    >
                      <span className="flex items-center gap-2">
                        <RotateCcw size={12} />
                        Original English
                      </span>
                    </button>
                  )}

                  <div className="max-h-60 overflow-y-auto space-y-0.5 custom-scrollbar">
                    {SUPPORTED_LANGUAGES.map((lang) => {
                      const isSelected = activeLang?.name === lang.name;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => handleSelectLanguage(lang)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/30"
                              : "text-gray-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.name}</span>
                          </span>
                          <span className="text-[11px] text-gray-500 font-mono">
                            {lang.native}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-9 h-9 rounded-xl bg-[#232332] border border-[#343446] flex items-center justify-center shrink-0 text-gray-300 mt-0.5">
          <User size={18} />
        </div>
      )}
    </div>
  );
}

export default ChatMessage;