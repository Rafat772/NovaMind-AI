import { Lock, Mail, LogOut } from "lucide-react";

function AccountSettings() {
  return (
    <div className="rounded-2xl border border-[#2D2D38] bg-[#111118] p-6">

      <h2 className="text-2xl font-semibold text-white mb-6">
        Account Settings
      </h2>

      <div className="space-y-4">

        <button
          className="w-full flex items-center gap-3 p-4 rounded-xl
          bg-[#1A1A22] hover:bg-[#242430]
          transition-all duration-300"
        >
          <Lock size={20} className="text-purple-400" />
          <span>Change Password</span>
        </button>

        <button
          className="w-full flex items-center gap-3 p-4 rounded-xl
          bg-[#1A1A22] hover:bg-[#242430]
          transition-all duration-300"
        >
          <Mail size={20} className="text-purple-400" />
          <span>Update Email</span>
        </button>

        <button
          className="w-full flex items-center gap-3 p-4 rounded-xl
          bg-red-500/10 hover:bg-red-500/20
          transition-all duration-300 text-red-400"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>

      </div>

    </div>
  );
}

export default AccountSettings;