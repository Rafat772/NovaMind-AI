import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import UploadCard from "../components/documents/UploadCard";
import SemanticSearchCard from "../components/documents/SemanticSearchCard";
import DocumentList from "../components/documents/DocumentList";
import DocumentCompareModal from "../components/documents/DocumentCompareModal";
import documentService from "../services/documentService";
import { Scale } from "lucide-react";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await documentService.getDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error("Failed to load documents:", err);
      setError("Failed to load documents. Please check your backend connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUploadSuccess = (newDoc) => {
    // Prepend the new document to the list immediately
    setDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
  };

  const handleDelete = async (docId) => {
    try {
      await documentService.deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      alert("Failed to delete document. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 sm:p-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Knowledge Base Documents
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Upload, inspect extracted chunks, and manage your AI-indexed literature.
            </p>
          </div>

          {documents && documents.length >= 2 && (
            <button
              type="button"
              onClick={() => setIsCompareOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-purple-600/30 cursor-pointer active:scale-95 shrink-0 self-start sm:self-auto"
            >
              <Scale size={16} />
              <span>Compare Documents</span>
            </button>
          )}
        </div>

        {/* Global Error Banner if initial fetch fails */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchDocuments}
              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Upload Card */}
        <UploadCard onUploadSuccess={handleUploadSuccess} />

        {/* Phase 3: Semantic Vector Search */}
        <SemanticSearchCard documents={documents} />

        {/* Document List */}
        <DocumentList

          documents={documents}
          isLoading={isLoading}
          onDelete={handleDelete}
          onRefresh={fetchDocuments}
        />

        {/* Document Comparison Modal */}
        <DocumentCompareModal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          documents={documents}
        />

      </div>
    </DashboardLayout>
  );
}

export default Documents;