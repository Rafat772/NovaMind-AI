import { Lock, Mail, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function AccountSettings() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="rounded-2xl border border-[#2D2D38] bg-[#111118] p-6">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Account Settings
      </h2>

      <div className="space-y-4">
        {/* Change Password */}
        <button
          onClick={() =>
            alert("A password reset link will be sent to " + (user?.email || "your email"))
          }
          className="w-full flex items-center justify-between p-4 rounded-xl
          bg-[#1A1A22]
          border border-transparent
          hover:border-purple-500
          hover:bg-[#242430]
          text-white
          transition-all duration-300
          cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Lock size={20} className="text-purple-400" />
            <span className="text-white font-medium">Change Password</span>
          </div>
          <span className="text-xs text-gray-500">Update security</span>
        </button>

        {/* Update Email */}
        <button
          onClick={() => alert("Current registered email is: " + (user?.email || "N/A"))}
          className="w-full flex items-center justify-between p-4 rounded-xl
          bg-[#1A1A22]
          border border-transparent
          hover:border-purple-500
          hover:bg-[#242430]
          text-white
          transition-all duration-300
          cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Mail size={20} className="text-purple-400" />
            <span className="text-white font-medium">Update Email</span>
          </div>
          <span className="text-xs text-gray-400 truncate max-w-[150px]">
            {user?.email || "No email"}
          </span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 rounded-xl
          bg-red-600/20
          border border-red-500/30
          hover:bg-red-600
          text-red-400
          hover:text-white
          transition-all duration-300
          cursor-pointer"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default AccountSettings;