import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ChatWindow from "../components/dashboard/ChatWindow";
import ChatInput from "../components/dashboard/ChatInput";
import chatService from "../services/chatService";
import documentService from "../services/documentService";
import { Plus, History, Trash2, BookOpen, Sparkles, MessageSquare } from "lucide-react";
import { useAuth } from "../context/useAuth";
import ExportChatDropdown from "../components/dashboard/ExportChatDropdown";

function Dashboard() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [activeSessionTitle, setActiveSessionTitle] = useState("New Research Chat");
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Load user sessions and documents on mount
  const loadInitialData = useCallback(async () => {
    try {
      const [sessionsData, docsData] = await Promise.all([
        chatService.getSessions(),
        documentService.getDocuments(),
      ]);
      setSessions(sessionsData || []);
      setDocuments(docsData.documents || []);

      // If user has previous sessions, load the latest one
      if (sessionsData && sessionsData.length > 0) {
        const latest = sessionsData[0];
        setActiveSessionId(latest.id);
        setActiveSessionTitle(latest.title);
        const history = await chatService.getSessionMessages(latest.id);
        setMessages(history || []);
      }
    } catch (err) {
      console.warn("Could not load initial chat data:", err);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Switch to an existing session
  const handleSelectSession = async (session) => {
    try {
      setActiveSessionId(session.id);
      setActiveSessionTitle(session.title);
      setShowHistory(false);
      setIsLoading(true);
      const history = await chatService.getSessionMessages(session.id);
      setMessages(history || []);
    } catch (err) {
      console.error("Failed to load session messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Start fresh chat session
  const handleNewChat = () => {
    setActiveSessionId(null);
    setActiveSessionTitle("New Research Chat");
    setMessages([]);
    setShowHistory(false);
  };

  // Delete a session
  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    try {
      await chatService.deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        handleNewChat();
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  // Send message to RAG pipeline
  const handleSendMessage = async (text, documentId) => {
    if (!text.trim() || isLoading) return;

    // Optimistic user message
    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: text,
      citations: [],
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage({
        message: text,
        session_id: activeSessionId,
        document_id: documentId,
      });

      // Update session ID if newly created
      if (!activeSessionId && response.session_id) {
        setActiveSessionId(response.session_id);
        setActiveSessionTitle(text.slice(0, 35) + "...");
      }

      // Replace optimistic message and append assistant message
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        response.user_message,
        response.assistant_message,
      ]);

      // Refresh sessions list
      const updatedSessions = await chatService.getSessions();
      setSessions(updatedSessions || []);
    } catch (err) {
      console.error("Failed to send chat message:", err);
      // Append error message from assistant
      const errorAssistantMsg = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "⚠️ I encountered an error while synthesizing your request. Please ensure the backend is running and try again.",
        citations: [],
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorAssistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-[#0B0B10] relative">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#2D2D38] bg-[#111118]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white max-w-[200px] sm:max-w-md truncate" title={activeSessionTitle}>
                {activeSessionTitle}
              </h2>
              <p className="text-[11px] text-gray-500">
                Grounded Literature Synthesis
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Export Dropdown */}
            <ExportChatDropdown
              sessionTitle={activeSessionTitle}
              messages={messages}
              user={user}
            />

            {/* History Toggle */}
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                showHistory
                  ? "bg-purple-600/20 text-purple-300 border-purple-500/40"
                  : "bg-[#161622] text-gray-300 border-[#2D2D38] hover:text-white"
              }`}
            >
              <History size={14} />
              <span className="hidden sm:inline">History ({sessions.length})</span>
            </button>

            {/* New Chat Button */}
            <button
              type="button"
              onClick={handleNewChat}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 transition-all shadow-md shadow-purple-600/25 active:scale-95 cursor-pointer"
            >
              <Plus size={14} />
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {/* Sessions History Drawer / Popover */}
        {showHistory && (
          <div className="absolute top-14 right-4 z-40 w-80 max-h-96 rounded-2xl bg-[#14141E] border border-[#2D2D38] shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-3 border-b border-[#2D2D38] flex items-center justify-between text-xs font-semibold text-gray-300">
              <span>Research Threads</span>
              <button
                type="button"
                onClick={handleNewChat}
                className="text-purple-400 hover:text-purple-300 font-medium"
              >
                + Start Fresh
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {sessions.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-500">
                  No previous chat history.
                </div>
              ) : (
                sessions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handleSelectSession(s)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors cursor-pointer group ${
                      activeSessionId === s.id
                        ? "bg-purple-600/20 text-purple-200 border border-purple-500/30"
                        : "text-gray-300 hover:bg-[#1B1B26]"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageSquare size={14} className="text-purple-400 shrink-0" />
                      <span className="truncate max-w-[190px] font-medium" title={s.title}>
                        {s.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(e, s.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-rose-400 transition-opacity"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Chat Message Window */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onPromptClick={(query) => handleSendMessage(query, selectedDocId)}
          />
        </div>

        {/* Input Bar */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          documents={documents}
          selectedDocId={selectedDocId}
          onSelectDocId={setSelectedDocId}
        />

      </div>
    </DashboardLayout>
  );
}

export default Dashboard;