import api from "./api";

export const reportService = {
  /**
   * Fetches real-time research analytics: overview, weekly activity, and recent history.
   * @returns {Promise<Object>}
   */
  async getAnalytics() {
    const response = await api.get("/reports/analytics");
    return response.data;
  },

  /**
   * Generates a comprehensive executive research synthesis report.
   * @param {Object} payload
   * @param {string} [payload.title]
   * @param {string} [payload.document_id]
   * @returns {Promise<Object>}
   */
  async generateReport({ title = "NovaMind AI Literature Synthesis Report", document_id = null } = {}) {
    const response = await api.post("/reports/generate", {
      title,
      document_id,
    });
    return response.data;
  },

  /**
   * Exports generated report content as a Markdown (.md) file download.
   */
  downloadReportMarkdown(title, markdownContent) {
    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeTitle = (title || "research_report").replace(/[^a-z0-9]/gi, "_").toLowerCase();
    link.href = url;
    link.setAttribute("download", `${safeTitle}.md`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export default reportService;
