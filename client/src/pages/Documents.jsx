import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import UploadCard from "../components/documents/UploadCard";
import SemanticSearchCard from "../components/documents/SemanticSearchCard";
import DocumentList from "../components/documents/DocumentList";
import documentService from "../services/documentService";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Knowledge Base Documents
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Upload, inspect extracted chunks, and manage your AI-indexed literature.
          </p>
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

      </div>
    </DashboardLayout>
  );
}

export default Documents;