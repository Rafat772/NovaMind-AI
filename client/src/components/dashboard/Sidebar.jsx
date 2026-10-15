import { NavLink, useNavigate } from "react-router-dom";
import {
  MessageSquarePlus,
  FolderOpen,
  FileText,
  Globe,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";

function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `w-full flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
      isActive
        ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.35)]"
        : "text-gray-300 hover:bg-[#1B1B24] hover:text-white"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-72 h-screen bg-[#111118] border-r border-[#2D2D38] p-6 flex flex-col shrink-0 select-none">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-violet-400 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
          <Sparkles size={20} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          NovaMind <span className="text-purple-400">AI</span>
        </h1>
      </div>

      {/* Primary Navigation */}
      <nav className="space-y-2 flex-1">
        <NavLink to="/dashboard" className={linkClass}>
          <MessageSquarePlus size={20} />
          <span>New Chat</span>
        </NavLink>

        <NavLink to="/documents" className={linkClass}>
          <FolderOpen size={20} />
          <span>Documents</span>
        </NavLink>

        <NavLink to="/reports" className={linkClass}>
          <FileText size={20} />
          <span>Reports</span>
        </NavLink>

        <button
          onClick={() =>
            alert(
              "Web Search integration is currently configured for research mode."
            )
          }
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-gray-300 hover:bg-[#1B1B24] hover:text-white transition cursor-pointer"
        >
          <Globe size={20} />
          <span>Web Search</span>
        </button>
      </nav>

      {/* Bottom Profile & Actions */}
      <div className="pt-4 border-t border-[#2D2D38] space-y-2">
        <NavLink to="/settings" className={linkClass}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-red-400 hover:bg-red-500/10 transition cursor-pointer"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>

        {user && (
          <div className="px-4 pt-2">
            <p className="text-[11px] text-gray-500 truncate">
              Signed in as <span className="text-gray-400">{user.email}</span>
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;