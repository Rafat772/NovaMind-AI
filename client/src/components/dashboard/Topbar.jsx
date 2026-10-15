import { Bell, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const displayName = user?.full_name ? user.full_name.split(" ")[0] : "Researcher";

  return (
    <header className="h-20 border-b border-[#2D2D38] flex items-center justify-between px-8 bg-[#111118]/60 backdrop-blur-md sticky top-0 z-20">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Welcome Back, {displayName} 👋
        </h2>
        <p className="text-gray-400 text-sm">
          Ready to start a new research session?
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="p-2.5 rounded-xl bg-[#1A1A22] border border-[#2D2D38] text-gray-400 hover:text-purple-400 hover:border-purple-500/50 transition cursor-pointer"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={19} />
        </button>

        <Link
          to="/settings"
          className="flex items-center gap-3 py-1.5 px-3 rounded-xl bg-[#1A1A22] border border-[#2D2D38] hover:border-purple-500/50 transition group"
          title="Account Settings"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm">
            {user?.full_name ? user.full_name.charAt(0) : "U"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white group-hover:text-purple-300 transition line-clamp-1">
              {user?.full_name || "User"}
            </p>
            <p className="text-[10px] text-gray-400 line-clamp-1 max-w-[120px]">
              {user?.email || ""}
            </p>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}

export default Topbar;