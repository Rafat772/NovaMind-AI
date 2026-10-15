import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, BookOpen, Layers, Mic, MicOff } from "lucide-react";
import { getSpeechRecognition } from "../../utils/speechUtils";

const SUGGESTIONS = [
  "Summarize the core findings and conclusion",
  "What methodology and dataset was used?",
  "What key limitations or future work are highlighted?",
  "Compare the key arguments across my papers",
];

function ChatInput({
  onSendMessage,
  isLoading = false,
  documents = [],
  selectedDocId = "",
  onSelectDocId,
}) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const baseTextRef = useRef("");

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    // Abort any lingering instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }

    // Snapshot existing text before starting dictation
    baseTextRef.current = text.trim();

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let cumulativeTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        cumulativeTranscript += event.results[i][0].transcript;
      }

      // Replace text cleanly with baseText + cumulative transcript (NO duplicates!)
      const prefix = baseTextRef.current ? baseTextRef.current + " " : "";
      const updatedText = prefix + cumulativeTranscript.trim();
      setText(updatedText);

      // Auto-adjust textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(
          textareaRef.current.scrollHeight,
          120
        )}px`;
      }
    };

    recognition.onerror = (e) => {
      console.warn("Speech recognition error:", e);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition start failed:", err);
      setIsListening(false);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading) return;

    onSendMessage(text.trim(), selectedDocId || null);
    setText("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    // Auto-adjust height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="border-t border-[#2D2D38] p-4 sm:p-6 bg-[#0E0E14]/90 backdrop-blur-md">
      
      {/* Suggestions and Scope Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        {/* Quick prompt chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1 shrink-0">
            <Sparkles size={12} className="text-purple-400" />
            Quick:
          </span>
          {SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setText(s);
                if (textareaRef.current) textareaRef.current.focus();
              }}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-full text-[11px] bg-[#161622] hover:bg-purple-600/20 text-gray-300 hover:text-purple-300 border border-[#2D2D38] hover:border-purple-500/40 transition-all shrink-0 cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Document Scope Filter */}
        {documents && documents.length > 0 && (
          <div className="flex items-center gap-1.5 shrink-0">
            <BookOpen size={14} className="text-purple-400" />
            <select
              value={selectedDocId}
              onChange={(e) => onSelectDocId && onSelectDocId(e.target.value)}
              className="text-xs bg-[#161622] text-gray-300 border border-[#2D2D38] rounded-lg px-2.5 py-1 focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="">All Documents ({documents.length})</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.filename.length > 24 ? d.filename.slice(0, 24) + "..." : d.filename}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="relative flex items-center bg-[#14141E] border border-[#2D2D38] focus-within:border-purple-500/80 focus-within:shadow-[0_0_15px_rgba(139,92,246,0.2)] rounded-2xl px-4 py-2 transition-all">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask NovaMind AI anything about your research papers... (Press Enter to send)"
          disabled={isLoading}
          className="flex-1 bg-transparent outline-none text-white text-sm placeholder:text-gray-500 resize-none max-h-32 py-1.5 leading-relaxed font-sans"
        />

        <div className="flex items-center gap-1.5 ml-2 shrink-0">
          {/* Voice Dictation (STT) Button */}
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? "Listening... Click to stop dictation" : "Dictate with voice"}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
              isListening
                ? "bg-red-500 text-white shadow-lg shadow-red-500/50 animate-pulse"
                : "bg-[#1C1C28] text-gray-400 hover:text-purple-400 hover:bg-[#252536] border border-[#2D2D38]"
            }`}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            {isListening && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full animate-ping"></span>
            )}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-md shadow-purple-600/30 active:scale-95 cursor-pointer text-white"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin text-white" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </form>

      <div className="flex items-center justify-between mt-2 text-[11px] text-gray-500 px-1">
        <span>Grounded in verified knowledge vectors</span>
        <span>Shift + Enter for new line</span>
      </div>

    </div>
  );
}

export default ChatInput;