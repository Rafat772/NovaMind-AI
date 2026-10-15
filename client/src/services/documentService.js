import api from "./api";

export const documentService = {
  /**
   * Uploads a single document (PDF, DOCX, TXT, MD) with progress tracking.
   * @param {File} file
   * @param {Function} [onProgress] Callback receiving (percentCompleted: number)
   * @returns {Promise<Object>} Processed document object
   */
  async uploadDocument(file, onProgress) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percent);
        }
      },
    });

    return response.data;
  },

  /**
   * Fetches all documents uploaded by the current user.
   * @returns {Promise<Array>} List of document objects
   */
  async getDocuments() {
    const response = await api.get("/documents");
    return response.data;
  },

  /**
   * Fetches document aggregate statistics.
   * @returns {Promise<Object>} Statistics object
   */
  async getDocumentStats() {
    const response = await api.get("/documents/stats");
    return response.data;
  },

  /**
   * Fetches specific document details including extracted text chunks.
   * @param {string} id Document ID
   * @returns {Promise<Object>} Document details with chunks
   */
  async getDocument(id) {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  /**
   * Deletes a document record and file.
   * @param {string} id Document ID
   * @returns {Promise<Object>}
   */
  async deleteDocument(id) {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },

  /**
   * Downloads the raw uploaded document file.
   * @param {string} id Document ID
   * @param {string} filename Original filename
   */
  async downloadDocument(id, filename) {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: "blob",
    });

    // Create a temporary object URL and trigger download
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename || "document");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Phase 3: Semantic search across document chunks using vector embeddings.
   * @param {Object} params
   * @param {string} params.query
   * @param {string} [params.document_id]
   * @param {number} [params.top_k]
   * @returns {Promise<Object>} { query, total_results, results: [...] }
   */
  async semanticSearch({ query, document_id = null, top_k = 5 }) {
    const response = await api.post("/documents/search", {
      query,
      document_id,
      top_k,
    });
    return response.data;
  },

  /**
   * Regenerates vector embeddings for a document.
   * @param {string} id Document ID
   * @returns {Promise<Object>}
   */
  async reindexDocument(id) {
    const response = await api.post(`/documents/${id}/reindex`);
    return response.data;
  },
};


export default documentService;
