import { useState } from "react";
import { Sparkles, User, FileText, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

function renderFormattedContent(text) {
  if (!text) return null;

  // Split lines
  const lines = text.split("\n");
  const elements = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headings ###
    if (line.startsWith("### ")) {
      elements.push(
        <h4 key={i} className="text-base font-bold text-white mt-3 mb-1.5 flex items-center gap-2">
          <span>{line.replace("### ", "")}</span>
        </h4>
      );
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h3 key={i} className="text-lg font-bold text-purple-300 mt-4 mb-2">
          {line.replace("## ", "")}
        </h3>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="border-l-2 border-purple-500 pl-3 my-2 text-gray-300 italic text-xs sm:text-sm bg-[#161622]/40 py-1 rounded-r-lg">
          {line.replace("> ", "")}
        </blockquote>
      );
      continue;
    }

    // Bullet points
    if (line.startsWith("* ") || line.startsWith("- ")) {
      const clean = line.substring(2);
      elements.push(
        <li key={i} className="text-gray-200 text-sm list-disc ml-5 my-1 leading-relaxed">
          {formatInlineBold(clean)}
        </li>
      );
      continue;
    }

    // Normal line
    if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="text-sm text-gray-200 leading-relaxed my-1">
          {formatInlineBold(line)}
        </p>
      );
    }
  }

  return elements;
}

function formatInlineBold(str) {
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function ChatMessage({ role, message, content, citations = [] }) {
  const isUser = role === "user";
  const textContent = content || message || "";
  const [showCitations, setShowCitations] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 mb-6 animate-in fade-in ${isUser ? "justify-end" : "justify-start"}`}>
      
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-600/30 text-white mt-0.5">
          <Sparkles size={18} />
        </div>
      )}

      {/* Message Container */}
      <div className={`max-w-2xl sm:max-w-3xl flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        
        <div
          className={`px-5 py-4 rounded-3xl transition-all duration-200 ${
            isUser
              ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-br-sm shadow-lg shadow-purple-600/20 text-sm leading-relaxed"
              : "bg-[#14141E] text-gray-200 rounded-tl-sm border border-[#2D2D38] shadow-xl w-full"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{textContent}</p>
          ) : (
            <div>{renderFormattedContent(textContent)}</div>
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
                  {citations.length} Grounded Research Source{citations.length > 1 ? "s" : ""}
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

        {/* Copy button below assistant message */}
        {!isUser && (
          <div className="flex items-center gap-2 mt-1.5 ml-2 text-xs text-gray-500">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 hover:text-purple-400 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-green-400" />
                  <span className="text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy response</span>
                </>
              )}
            </button>
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