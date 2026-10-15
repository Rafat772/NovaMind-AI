import { useState } from "react";
import { X, Download, Copy, Check, FileText, Sparkles, BookOpen, Layers } from "lucide-react";
import reportService from "../../services/reportService";

function ReportModal({ report, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(report.summary_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    reportService.downloadReportMarkdown(report.title, report.summary_markdown);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl bg-[#111118] border border-[#2D2D38] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2D2D38] bg-[#161622]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white max-w-md truncate">
                {report.title}
              </h2>
              <p className="text-xs text-gray-400">
                AI Knowledge Base & Literature Synthesis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors cursor-pointer shadow-md"
            >
              <Download size={14} />
              <span>Export .md</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-6 py-3.5 bg-[#0D0D14] border-b border-[#2D2D38]/60 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-purple-400" />
            <span>Documents: <strong className="text-white">{report.total_documents_analyzed}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-blue-400" />
            <span>Chunks Synthesized: <strong className="text-white">{report.total_chunks_synthesized}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-emerald-400" />
            <span>Generated: <strong className="text-white">{new Date(report.generated_at).toLocaleDateString()}</strong></span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-4">
          <div className="p-6 rounded-2xl bg-[#161622] border border-[#262636] font-mono text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
            {report.summary_markdown}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#2D2D38] bg-[#161622]/60 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-purple-300 transition-colors"
          >
            {copied ? (
              <>
                <Check size={14} className="text-green-400" />
                <span className="text-green-400">Copied to clipboard</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Markdown</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default ReportModal;
