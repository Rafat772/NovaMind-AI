import {
  MessageSquarePlus,
  FolderOpen,
  FileText,
  Globe,
  Settings,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="w-72 h-screen bg-[#111118] border-r border-[#2D2D38] p-6 flex flex-col">

      {/* Logo */}

      <h1 className="text-3xl font-bold text-white mb-10">
        NovaMind <span className="text-purple-500">AI</span>
      </h1>

      {/* Menu */}

      <nav className="space-y-3">

        <button className="w-full flex items-center gap-3 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-3 text-white transition">
          <MessageSquarePlus size={20} />
          New Chat
        </button>

        <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-[#1B1B24] transition">
          <FolderOpen size={20} />
          Documents
        </button>

        <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-[#1B1B24] transition">
          <FileText size={20} />
          Reports
        </button>

        <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-[#1B1B24] transition">
          <Globe size={20} />
          Web Search
        </button>

      </nav>

      {/* Bottom */}

      <div className="mt-auto">

        <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-[#1B1B24] transition">
          <Settings size={20} />
          Settings
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;