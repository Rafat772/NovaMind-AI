import api from "./api";

export const chatService = {
  /**
   * Sends a user query to the RAG chat pipeline.
   * @param {Object} payload
   * @param {string} payload.message
   * @param {string} [payload.session_id]
   * @param {string} [payload.document_id]
   * @returns {Promise<Object>} { session_id, user_message, assistant_message }
   */
  async sendMessage({ message, session_id = null, document_id = null }) {
    const response = await api.post("/chat/message", {
      message,
      session_id,
      document_id,
    });
    return response.data;
  },

  /**
   * Fetches all research conversation sessions for the current user.
   * @returns {Promise<Array>}
   */
  async getSessions() {
    const response = await api.get("/chat/sessions");
    return response.data;
  },

  /**
   * Creates a new chat session thread.
   * @param {string} [title]
   * @returns {Promise<Object>}
   */
  async createSession(title = "New Research Chat") {
    const response = await api.post("/chat/sessions", { title });
    return response.data;
  },

  /**
   * Gets message history for a given session.
   * @param {string} sessionId
   * @returns {Promise<Array>} List of messages with citations
   */
  async getSessionMessages(sessionId) {
    const response = await api.get(`/chat/sessions/${sessionId}/messages`);
    return response.data;
  },

  /**
   * Deletes a chat session.
   * @param {string} sessionId
   * @returns {Promise<Object>}
   */
  async deleteSession(sessionId) {
    const response = await api.delete(`/chat/sessions/${sessionId}`);
    return response.data;
  },

  /**
   * Translates research text into a target language using Gemini.
   * @param {Object} payload
   * @param {string} payload.text
   * @param {string} payload.target_language
   * @returns {Promise<Object>} { original_text, target_language, translated_text }
   */
  async translateMessage({ text, target_language }) {
    const response = await api.post("/chat/translate", {
      text,
      target_language,
    });
    return response.data;
  },
};

export default chatService;
