import { useState } from "react";
import {
  Sparkles,
  Search,
  BookOpen,
  Copy,
  Check,
  FileText,
  Layers,
  ArrowRight,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import documentService from "../../services/documentService";

function SemanticSearchCard({ documents = [] }) {
  const [query, setQuery] = useState("");
  const [selectedDocId, setSelectedDocId] = useState("");
  const [topK, setTopK] = useState(4);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setIsSearching(true);
      setErrorMessage("");
      setHasSearched(true);

      const data = await documentService.semanticSearch({
        query: query.trim(),
        document_id: selectedDocId || null,
        top_k: Number(topK),
      });

      setResults(data.results || []);
    } catch (err) {
      console.error("Semantic search failed:", err);
      setErrorMessage(
        err.response?.data?.detail || "Search failed. Please ensure you have uploaded documents."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="mb-10 rounded-3xl border border-[#2D2D38] bg-[#111118]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Background glow decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 mb-2">
            <Sparkles size={14} className="text-purple-400" />
            <span>Phase 3 • Vector Similarity Search</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            Ask Your Knowledge Base
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Search your indexed research literature by conceptual meaning, not just keywords.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-3">
          {documents.length > 0 && (
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-[#161622] border border-[#2D2D38] text-gray-300 focus:outline-none focus:border-purple-500 transition-colors"
            >
              <option value="">All Documents ({documents.length})</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.filename.length > 25 ? d.filename.slice(0, 25) + "..." : d.filename}
                </option>
              ))}
            </select>
          )}

          <select
            value={topK}
            onChange={(e) => setTopK(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-[#161622] border border-[#2D2D38] text-gray-300 focus:outline-none focus:border-purple-500 transition-colors"
          >
            <option value={3}>Top 3</option>
            <option value={4}>Top 4</option>
            <option value={6}>Top 6</option>
            <option value={10}>Top 10</option>
          </select>
        </div>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative flex items-center">
          <Search size={20} className="absolute left-4 text-purple-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. What methodology was used? What are the key limitations? What were the benchmark results?"
            className="w-full pl-12 pr-32 py-3.5 rounded-2xl bg-[#161622] border border-[#2D2D38] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white
              bg-gradient-to-r from-purple-600 to-fuchsia-500
              hover:from-purple-500 hover:to-fuchsia-400
              active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-md shadow-purple-600/30"
          >
            {isSearching ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <span>Search</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm">
          {errorMessage}
        </div>
      )}

      {/* Search Results Display */}
      {hasSearched && (
        <div className="mt-6 pt-6 border-t border-[#2D2D38]/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={16} className="text-purple-400" />
              <span>Semantic Matches for: "{query}"</span>
            </h3>
            <span className="text-xs text-gray-400">
              {results.length} passages retrieved
            </span>
          </div>

          {results.length === 0 ? (
            <div className="text-center py-10 rounded-2xl bg-[#161622]/50 border border-dashed border-[#2D2D38] text-gray-400">
              <p className="text-sm">No relevant passages found in your indexed documents.</p>
              <p className="text-xs text-gray-500 mt-1">Try phrasing your question differently or upload more papers.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((res, index) => {
                const matchPercent = Math.round(res.score * 100);
                const isHighMatch = matchPercent >= 70;

                return (
                  <div
                    key={`${res.document_id}-${res.chunk_index}-${index}`}
                    className="flex flex-col justify-between p-4 rounded-2xl bg-[#161622] border border-[#2D2D38] hover:border-purple-500/40 transition-all duration-300 group shadow-lg shadow-black/20"
                  >
                    <div>
                      {/* Meta header */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText size={14} className="text-purple-400 shrink-0" />
                          <span className="text-xs font-semibold text-white truncate max-w-[170px]" title={res.filename}>
                            {res.filename}
                          </span>
                          {res.page_number && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-[#2D2D38]">
                              Page {res.page_number}
                            </span>
                          )}
                        </div>

                        {/* Match score badge */}
                        <div
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                            isHighMatch
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                              : "bg-purple-500/10 text-purple-300 border-purple-500/30"
                          }`}
                        >
                          {matchPercent}% Match
                        </div>
                      </div>

                      {/* Content snippet */}
                      <p className="text-xs text-gray-300 leading-relaxed font-mono bg-[#0D0D14] p-3 rounded-xl border border-[#222230] line-clamp-6 whitespace-pre-wrap">
                        {res.content}
                      </p>
                    </div>

                    {/* Footer with copy button */}
                    <div className="mt-3 pt-3 border-t border-[#232330] flex items-center justify-between text-xs text-gray-400">
                      <span className="text-[11px] text-gray-500">
                        Chunk #{res.chunk_index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(res.content, index)}
                        className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-purple-300 transition-colors px-2 py-1 rounded hover:bg-white/5 cursor-pointer"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check size={12} className="text-green-400" />
                            <span className="text-green-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy Citation</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default SemanticSearchCard;
