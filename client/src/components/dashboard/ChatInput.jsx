import { Paperclip, Globe, Send } from "lucide-react";

function ChatInput() {
  return (
    <div className="border-t border-[#2D2D38] p-6">

      <div className="flex items-center gap-3 mb-4">

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#181820] hover:bg-[#23232d] text-gray-300 transition">
          <Paperclip size={18} />
          Upload
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#181820] hover:bg-[#23232d] text-gray-300 transition">
          <Globe size={18} />
          Web Search
        </button>

      </div>

      <div className="flex items-center bg-[#111118] border border-[#2D2D38] rounded-2xl px-4 py-3">

        <input
          type="text"
          placeholder="Ask anything about your documents..."
          className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-500"
        />

        <button className="ml-3 w-11 h-11 rounded-full bg-purple-600 hover:bg-purple-500 flex items-center justify-center transition">
          <Send size={18} className="text-white" />
        </button>

      </div>

    </div>
  );
}

export default ChatInput;