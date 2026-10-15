import React, { useState } from "react";
import {
  X,
  Scale,
  Sparkles,
  ArrowRight,
  Loader2,
  FileText,
  Download,
  Copy,
  Check,
  Printer,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import documentService from "../../services/documentService";

const FOCUS_OPTIONS = [
  { id: "comprehensive", label: "Comprehensive Analysis", desc: "Full synthesis across arguments and structures" },
  { id: "methodology", label: "Methodologies & Technical Stack", desc: "Compare techniques, frameworks, and workflows" },
  { id: "findings", label: "Core Findings & Contributions", desc: "Contrast primary discoveries and achievements" },
  { id: "limitations", label: "Limitations & Future Roadmap", desc: "Evaluate challenges and areas of improvement" },
];

const DocumentCompareModal = ({ isOpen, onClose, documents = [] }) => {
  const [docAId, setDocAId] = useState(documents[0]?.id || "");
  const [docBId, setDocBId] = useState(documents[1]?.id || documents[0]?.id || "");
  const [focus, setFocus] = useState("comprehensive");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCompare = async () => {
    if (!docAId || !docBId) {
      setError("Please select both documents to compare.");
      return;
    }
    if (docAId === docBId) {
      setError("Please choose two different documents for comparative synthesis.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await documentService.compareDocuments({
        document_id_a: docAId,
        document_id_b: docBId,
        focus,
      });
      setResult(data);
    } catch (err) {
      console.error("Failed to compare documents:", err);
      setError(err?.response?.data?.detail || "Failed to generate comparative synthesis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.comparison_markdown) return;
    try {
      await navigator.clipboard.writeText(result.comparison_markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleDownload = () => {
    if (!result?.comparison_markdown) return;
    const blob = new Blob([result.comparison_markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comparison-${result.document_a.filename}-vs-${result.document_b.filename}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!result?.comparison_markdown) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Comparative Synthesis: ${result.document_a.filename} vs ${result.document_b.filename}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; padding: 28px; color: #1e1b4b; }
            h1, h2, h3 { color: #6d28d9; }
            table { width: 100%; border-collapse: collapse; margin: 16px 0; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
            th { background: #f1f5f9; }
            blockquote { border-left: 4px solid #8b5cf6; margin: 12px 0; padding-left: 12px; color: #475569; font-style: italic; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <pre style="white-space: pre-wrap; font-family: inherit;">${result.comparison_markdown}</pre>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#12121A] border border-[#2D2D38] rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D2D38] bg-[#161622]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Scale size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Comparative Literature Synthesis
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Dual-Document AI
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Contrast findings, methodologies, and themes side-by-side using Gemini RAG
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-gray-400 hover:text-white hover:bg-[#232332] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Document Selectors Row */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
            
            {/* Document A */}
            <div className="md:col-span-5 p-4 rounded-2xl bg-[#171724] border border-[#2D2D38]">
              <label className="block text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2">
                Document 1 (Primary)
              </label>
              <select
                value={docAId}
                onChange={(e) => setDocAId(e.target.value)}
                className="w-full bg-[#0E0E16] text-sm text-gray-200 border border-[#2D2D38] rounded-xl px-3 py-2.5 outline-none focus:border-purple-500 transition-colors"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.filename} ({d.file_type.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* VS Badge */}
            <div className="md:col-span-1 flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-xs flex items-center justify-center shadow-lg shadow-purple-600/30">
                VS
              </div>
            </div>

            {/* Document B */}
            <div className="md:col-span-5 p-4 rounded-2xl bg-[#171724] border border-[#2D2D38]">
              <label className="block text-xs font-semibold text-fuchsia-300 uppercase tracking-wider mb-2">
                Document 2 (Comparative)
              </label>
              <select
                value={docBId}
                onChange={(e) => setDocBId(e.target.value)}
                className="w-full bg-[#0E0E16] text-sm text-gray-200 border border-[#2D2D38] rounded-xl px-3 py-2.5 outline-none focus:border-purple-500 transition-colors"
              >
                {documents.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.filename} ({d.file_type.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Focus Pills */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-2">
              Select Comparison Lens:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {FOCUS_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFocus(opt.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    focus === opt.id
                      ? "bg-purple-600/20 border-purple-500/50 text-white shadow-md shadow-purple-600/10"
                      : "bg-[#171724] border-[#2D2D38] text-gray-400 hover:text-gray-200 hover:border-[#3D3D4E]"
                  }`}
                >
                  <div className="font-semibold text-xs text-gray-200 mb-0.5">{opt.label}</div>
                  <div className="text-[11px] text-gray-500 line-clamp-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              {error}
            </div>
          )}

          {/* Action Trigger Button */}
          <div className="flex justify-end">
            <button
              type="button"
              disabled={isLoading || documents.length < 2}
              onClick={handleCompare}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-white" />
                  <span>Synthesizing Comparative Analysis...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Synthesize Comparison</span>
                </>
              )}
            </button>
          </div>

          {/* Results Output */}
          {result && (
            <div className="mt-6 space-y-4 animate-in fade-in duration-200">
              
              {/* Comparison Header Meta Banner */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-900/20 to-fuchsia-900/20 border border-purple-500/30">
                <div>
                  <div className="text-[11px] text-purple-400 font-semibold uppercase">Document A</div>
                  <div className="font-bold text-white text-sm truncate">{result.document_a.filename}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {result.document_a.file_type} • {result.document_a.chunk_count} Chunks • {result.document_a.page_count} Pages
                  </div>
                </div>

                <div className="border-l border-white/10 pl-4">
                  <div className="text-[11px] text-fuchsia-400 font-semibold uppercase">Document B</div>
                  <div className="font-bold text-white text-sm truncate">{result.document_b.filename}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {result.document_b.file_type} • {result.document_b.chunk_count} Chunks • {result.document_b.page_count} Pages
                  </div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Comparative Findings
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-[#1A1A26] border border-[#2D2D38] text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-[#1A1A26] border border-[#2D2D38] text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Download (.md)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-[#1A1A26] border border-[#2D2D38] text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Printer size={13} />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Markdown Display Box */}
              <div className="p-6 rounded-2xl bg-[#0B0B12] border border-[#232332] text-sm text-gray-200 leading-relaxed font-sans max-h-[50vh] overflow-y-auto whitespace-pre-wrap selection:bg-purple-600/30">
                {result.comparison_markdown}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default DocumentCompareModal;
