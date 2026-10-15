import { User, Sparkles } from "lucide-react";
import { useAuth } from "../../context/useAuth";

function ProfileCard() {
  const { user } = useAuth();

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="rounded-2xl border border-[#2D2D38] bg-[#111118] p-8">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-purple-600 to-violet-500 flex items-center justify-center mb-5 text-white text-3xl font-bold shadow-[0_0_25px_rgba(168,85,247,0.35)]">
          {user?.full_name ? user.full_name.charAt(0).toUpperCase() : <User size={40} />}
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight">
          {user?.full_name || "AI Researcher"}
        </h2>

        <p className="text-gray-400 text-sm mt-1">
          {user?.email || "researcher@novamind.ai"}
        </p>

        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-medium">
          <Sparkles size={13} />
          <span>NovaMind Pro Member</span>
        </div>

        <div className="w-full mt-6 pt-6 border-t border-[#2D2D38] grid grid-cols-2 gap-4 text-left">
          <div>
            <p className="text-xs text-gray-500">Member Since</p>
            <p className="text-sm font-semibold text-gray-200 mt-0.5">{formattedDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Account Status</p>
            <p className="text-sm font-semibold text-green-400 mt-0.5">Active</p>
          </div>
        </div>

        <button
          onClick={() => alert("Profile details updated successfully.")}
          className="w-full mt-6 px-6 py-3 rounded-xl
          bg-gradient-to-r from-purple-600 to-fuchsia-500
          hover:from-purple-500 hover:to-fuchsia-400
          transition-all duration-300
          text-white font-semibold text-sm cursor-pointer shadow-md"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default ProfileCard;