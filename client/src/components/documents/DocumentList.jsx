import { useState } from "react";
import {
  Search,
  Layers,
  FileText,
  HardDrive,
  RefreshCw,
  FolderOpen,
  Filter,
} from "lucide-react";
import DocumentCard from "./DocumentCard";
import DocumentDetailModal from "./DocumentDetailModal";
import documentService from "../../services/documentService";

function formatTotalBytes(bytes) {
  if (!bytes) return "0 MB";
  const mb = bytes / (1024 * 1024);
  if (mb < 1) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${mb.toFixed(1)} MB`;
}

function DocumentList({
  documents = [],
  isLoading = false,
  onDelete,
  onRefresh,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [activeModalDoc, setActiveModalDoc] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Compute summary stats
  const totalDocs = documents.length;
  const totalChunks = documents.reduce((acc, d) => acc + (d.chunk_count || 0), 0);
  const totalBytes = documents.reduce((acc, d) => acc + (d.file_size || 0), 0);

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.filename
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedType === "all") return true;
    if (selectedType === "pdf") return doc.file_type === "pdf";
    if (selectedType === "docx")
      return doc.file_type === "docx" || doc.file_type === "doc";
    if (selectedType === "txt")
      return doc.file_type === "txt" || doc.file_type === "md";
    return true;
  });

  const handleDownload = async (id, filename) => {
    try {
      await documentService.downloadDocument(id, filename);
    } catch (err) {
      alert("Failed to download document. Please try again.");
    }
  };

  const handleViewChunks = async (doc) => {
    // If doc already has chunks, open immediately
    if (doc.chunks && doc.chunks.length > 0) {
      setActiveModalDoc(doc);
      return;
    }

    // Otherwise fetch document details with chunks
    try {
      setIsLoadingDetails(true);
      const detailed = await documentService.getDocument(doc.id);
      setActiveModalDoc(detailed);
    } catch (err) {
      alert("Failed to load document chunks.");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <div>
      {/* Header and Stats Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-[#111118] border border-[#2D2D38] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Documents</p>
            <p className="text-xl font-bold text-white">{totalDocs}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#111118] border border-[#2D2D38] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Layers size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400">Indexed Chunks</p>
            <p className="text-xl font-bold text-white">{totalChunks}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#111118] border border-[#2D2D38] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <HardDrive size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400">Knowledge Base Size</p>
            <p className="text-xl font-bold text-white">{formatTotalBytes(totalBytes)}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search documents by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#111118] border border-[#2D2D38] text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedType("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              selectedType === "all"
                ? "bg-purple-600 text-white"
                : "bg-[#111118] border border-[#2D2D38] text-gray-400 hover:text-white"
            }`}
          >
            All ({totalDocs})
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("pdf")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              selectedType === "pdf"
                ? "bg-rose-600 text-white"
                : "bg-[#111118] border border-[#2D2D38] text-gray-400 hover:text-white"
            }`}
          >
            PDF
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("docx")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              selectedType === "docx"
                ? "bg-blue-600 text-white"
                : "bg-[#111118] border border-[#2D2D38] text-gray-400 hover:text-white"
            }`}
          >
            DOCX
          </button>
          <button
            type="button"
            onClick={() => setSelectedType("txt")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              selectedType === "txt"
                ? "bg-emerald-600 text-white"
                : "bg-[#111118] border border-[#2D2D38] text-gray-400 hover:text-white"
            }`}
          >
            TXT / MD
          </button>

          {/* Refresh Button */}
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              title="Refresh list"
              className="p-2 rounded-xl bg-[#111118] border border-[#2D2D38] text-gray-400 hover:text-white hover:border-gray-500 transition-colors ml-1 cursor-pointer"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>
          )}
        </div>

      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {isLoading ? (
          /* Loading Skeletons */
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-[#111118] border border-[#2D2D38] animate-pulse"
              />
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-[#2D2D38] bg-[#111118]/50">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-600/10 text-purple-400 flex items-center justify-center">
              <FolderOpen size={32} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {searchTerm
                ? "No matching documents found"
                : "No documents in your knowledge base"}
            </h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto">
              {searchTerm
                ? `No documents match "${searchTerm}". Try a different search term or clear the filter.`
                : "Upload your research papers, notes, or articles using the upload card above to start indexing."}
            </p>
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onViewChunks={handleViewChunks}
              onDownload={handleDownload}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {/* Detail / Chunks Modal */}
      {activeModalDoc && (
        <DocumentDetailModal
          document={activeModalDoc}
          onClose={() => setActiveModalDoc(null)}
        />
      )}
    </div>
  );
}

export default DocumentList;