import { Lock, Mail, LogOut } from "lucide-react";

function AccountSettings() {
  return (
    <div className="rounded-2xl border border-[#2D2D38] bg-[#111118] p-6">
      <h2 className="text-2xl font-semibold text-white mb-6">
        Account Settings
      </h2>

      <div className="space-y-4">
        {/* Change Password */}
        <button
          className="w-full flex items-center gap-3 p-4 rounded-xl
          bg-[#1A1A22]
          border border-transparent
          hover:border-purple-500
          hover:bg-[#242430]
          text-white
          transition-all duration-300
          cursor-pointer"
        >
          <Lock size={20} className="text-purple-400" />
          <span className="text-white font-medium">
            Change Password
          </span>
        </button>

        {/* Update Email */}
        <button
          className="w-full flex items-center gap-3 p-4 rounded-xl
          bg-[#1A1A22]
          border border-transparent
          hover:border-purple-500
          hover:bg-[#242430]
          text-white
          transition-all duration-300
          cursor-pointer"
        >
          <Mail size={20} className="text-purple-400" />
          <span className="text-white font-medium">
            Update Email
          </span>
        </button>

        {/* Logout */}
        <button
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
          <span className="font-medium">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}

export default AccountSettings;