import React, { useState, useRef, useEffect } from "react";
import { Download, FileText, Printer, Copy, Check, ChevronDown } from "lucide-react";
import { downloadMarkdownFile, exportChatToPDF, generateChatMarkdown } from "../../utils/exportChat";

const ExportChatDropdown = ({ sessionTitle, messages, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);

  const hasMessages = messages && messages.length > 0;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownloadMarkdown = () => {
    downloadMarkdownFile(sessionTitle, messages, user);
    setIsOpen(false);
  };

  const handleExportPDF = () => {
    exportChatToPDF(sessionTitle, messages, user);
    setIsOpen(false);
  };

  const handleCopyChat = async () => {
    try {
      const text = generateChatMarkdown(sessionTitle, messages, user);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy transcript:", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        disabled={!hasMessages}
        onClick={() => setIsOpen(!isOpen)}
        title={!hasMessages ? "Send a message first to export chat" : "Export research chat"}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
          !hasMessages
            ? "opacity-50 cursor-not-allowed bg-[#161622] text-gray-500 border-[#2D2D38]"
            : isOpen
            ? "bg-purple-600/20 text-purple-300 border-purple-500/40"
            : "bg-[#161622] text-gray-300 border-[#2D2D38] hover:text-white hover:border-[#3D3D4E]"
        }`}
      >
        <Download size={13} className="text-purple-400" />
        <span className="hidden sm:inline">Export</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#161622]/95 backdrop-blur-xl border border-[#2D2D38] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-[#2D2D38]/60 mb-1">
            <p className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
              Export Transcript
            </p>
            <p className="text-[10px] text-gray-500 truncate">
              {messages.length} message{messages.length === 1 ? "" : "s"} with citations
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-purple-600/20 transition-colors text-left cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
              <FileText size={13} />
            </div>
            <div>
              <div className="font-medium text-gray-200">Markdown (.md)</div>
              <div className="text-[10px] text-gray-500">Raw research notes</div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleExportPDF}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-purple-600/20 transition-colors text-left cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Printer size={13} />
            </div>
            <div>
              <div className="font-medium text-gray-200">Print / Save as PDF</div>
              <div className="text-[10px] text-gray-500">Styled academic report</div>
            </div>
          </button>

          <button
            type="button"
            onClick={handleCopyChat}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-300 hover:text-white hover:bg-purple-600/20 transition-colors text-left cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </div>
            <div>
              <div className="font-medium text-gray-200">
                {copied ? "Copied to Clipboard!" : "Copy Transcript"}
              </div>
              <div className="text-[10px] text-gray-500">Full text with citations</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportChatDropdown;
