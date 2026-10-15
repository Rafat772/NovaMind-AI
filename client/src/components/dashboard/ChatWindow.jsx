import { useEffect, useRef } from "react";
import { Sparkles, BookOpen, Layers, Search, Compass, MessageSquare } from "lucide-react";
import ChatMessage from "./ChatMessage";

function ChatWindow({ messages = [], isLoading = false, onPromptClick }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const samplePrompts = [
    {
      icon: BookOpen,
      title: "Synthesize Literature",
      desc: "Summarize the primary conclusions and methodology across all papers",
      query: "Provide a comprehensive synthesis of the key findings and conclusions in my literature.",
    },
    {
      icon: Layers,
      title: "Compare Findings",
      desc: "Examine consensus vs disagreement between different studies",
      query: "Compare the key methodologies and arguments between the uploaded papers.",
    },
    {
      icon: Compass,
      title: "Identify Research Gaps",
      desc: "Spot limitations and future research opportunities",
      query: "What research limitations and open problems are highlighted in these documents?",
    },
    {
      icon: Search,
      title: "Citation Extraction",
      desc: "Retrieve verified citations and page references for key claims",
      query: "List the most important quantitative metrics reported along with page numbers.",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-4">
      {messages.length === 0 ? (
        /* Empty / Welcome State */
        <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-12 px-4 animate-in fade-in">
          
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center text-white shadow-2xl shadow-purple-600/30 mb-6">
            <Sparkles size={32} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
            NovaMind AI Research Assistant
          </h2>

          <p className="text-gray-400 text-sm max-w-md mb-8 leading-relaxed">
            Your literature-grounded intelligence workspace. Ask questions, synthesize concepts,
            and inspect verified citations extracted from your knowledge base.
          </p>

          {/* Quick Prompt Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
            {samplePrompts.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onPromptClick && onPromptClick(p.query)}
                  className="p-4 rounded-2xl bg-[#14141E] border border-[#2D2D38] hover:border-purple-500/50 hover:bg-[#181824] transition-all group cursor-pointer text-left shadow-lg shadow-black/20"
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                      <IconComp size={16} />
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 leading-normal line-clamp-2">
                    {p.desc}
                  </p>
                </button>
              );
            })}
          </div>

        </div>
      ) : (
        /* Message list */
        <div>
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              citations={msg.citations || []}
            />
          ))}

          {/* Typing animation when waiting for assistant */}
          {isLoading && (
            <div className="flex items-center gap-3 mb-6 animate-in fade-in">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-600/30 text-white">
                <Sparkles size={18} />
              </div>
              <div className="px-5 py-4 rounded-3xl rounded-tl-sm bg-[#14141E] border border-[#2D2D38] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="text-xs text-gray-400 ml-2 font-mono">Synthesizing verified knowledge...</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}

export default ChatWindow;