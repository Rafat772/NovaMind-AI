import { NavLink } from "react-router-dom";
import {
  MessageSquarePlus,
  FolderOpen,
  FileText,
  Globe,
  Settings,
} from "lucide-react";

function Sidebar() {
  const linkClass = ({ isActive }) =>
    `w-full flex items-center gap-3 rounded-xl px-4 py-3 transition ${
      isActive
        ? "bg-purple-600 text-white"
        : "text-gray-300 hover:bg-[#1B1B24]"
    }`;

  return (
    <aside className="w-72 h-screen bg-[#111118] border-r border-[#2D2D38] p-6 flex flex-col">

      {/* Logo */}
      <h1 className="text-3xl font-bold text-white mb-10">
        NovaMind <span className="text-purple-500">AI</span>
      </h1>

      {/* Menu */}
      <nav className="space-y-3">

        <NavLink to="/dashboard" className={linkClass}>
          <MessageSquarePlus size={20} />
          New Chat
        </NavLink>

        <NavLink to="/documents" className={linkClass}>
          <FolderOpen size={20} />
          Documents
        </NavLink>

        <NavLink to="/reports" className={linkClass}>
          <FileText size={20} />
          Reports
        </NavLink>

        <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-gray-300 hover:bg-[#1B1B24] transition">
          <Globe size={20} />
          Web Search
        </button>

      </nav>

      {/* Bottom */}
      <div className="mt-auto">

        <NavLink to="/settings" className={linkClass}>
          <Settings size={20} />
          Settings
        </NavLink>

      </div>

    </aside>
  );
}

export default Sidebar;