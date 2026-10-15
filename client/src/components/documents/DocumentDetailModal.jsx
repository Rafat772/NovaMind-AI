import { useState } from "react";
import { X, Layers, FileText, Calendar, HardDrive, Hash, Copy, Check } from "lucide-react";

function DocumentDetailModal({ document, onClose }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [searchChunk, setSearchChunk] = useState("");

  if (!document) return null;

  const handleCopyChunk = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredChunks = (document.chunks || []).filter((chunk) =>
    chunk.content.toLowerCase().includes(searchChunk.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl bg-[#111118] border border-[#2D2D38] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2D2D38] bg-[#161622]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white max-w-lg truncate" title={document.filename}>
                {document.filename}
              </h2>
              <p className="text-xs text-gray-400">
                Extracted Chunks & Knowledge Representation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Document Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-4 bg-[#0D0D14] border-b border-[#2D2D38]/60 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-purple-400" />
            <span>Chunks: <strong className="text-white">{document.chunk_count || 0}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Hash size={14} className="text-blue-400" />
            <span>Characters: <strong className="text-white">{document.total_characters?.toLocaleString() || 0}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive size={14} className="text-emerald-400" />
            <span>Pages: <strong className="text-white">{document.page_count || 1}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-amber-400" />
            <span>Type: <strong className="text-white uppercase">{document.file_type}</strong></span>
          </div>
        </div>

        {/* Chunks Search */}
        <div className="px-6 py-3 border-b border-[#2D2D38]/60 bg-[#111118]">
          <input
            type="text"
            placeholder="Search within extracted chunks..."
            value={searchChunk}
            onChange={(e) => setSearchChunk(e.target.value)}
            className="w-full px-4 py-2 text-sm rounded-xl bg-[#161622] border border-[#2D2D38] text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Chunks List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredChunks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Layers size={36} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No chunks match your search query.</p>
            </div>
          ) : (
            filteredChunks.map((chunk) => (
              <div
                key={chunk.chunk_index}
                className="group relative rounded-2xl bg-[#161622] border border-[#2D2D38] p-4 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                      Chunk #{chunk.chunk_index + 1}
                    </span>
                    {chunk.page_number && (
                      <span className="text-gray-500">
                        Page {chunk.page_number}
                      </span>
                    )}
                    <span className="text-gray-500">
                      • {chunk.char_count} chars
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyChunk(chunk.content, chunk.chunk_index)}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-purple-300 transition-colors px-2 py-1 rounded hover:bg-white/5"
                  >
                    {copiedIndex === chunk.chunk_index ? (
                      <>
                        <Check size={12} className="text-green-400" />
                        <span className="text-green-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-sm text-gray-200 font-mono whitespace-pre-wrap leading-relaxed bg-[#0D0D14] p-3 rounded-xl border border-[#232330]">
                  {chunk.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#2D2D38] bg-[#161622]/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default DocumentDetailModal;
