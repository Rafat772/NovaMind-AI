import React, { useState } from "react";
import { User, Sparkles, Edit2, Check, X, Loader2 } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import authService from "../../services/authService";

function ProfileCard() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const formattedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const handleSave = async () => {
    if (!fullName.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const updated = await authService.updateProfile({ full_name: fullName.trim() });
      updateUser(updated);
      setMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err?.response?.data?.detail || "Could not update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFullName(user?.full_name || "");
    setIsEditing(false);
    setError("");
  };

  return (
    <div className="rounded-2xl border border-[#2D2D38] bg-[#111118] p-8">
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-purple-600 to-violet-500 flex items-center justify-center mb-5 text-white text-3xl font-bold shadow-[0_0_25px_rgba(168,85,247,0.35)] overflow-hidden">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
          ) : user?.full_name ? (
            user.full_name.charAt(0).toUpperCase()
          ) : (
            <User size={40} />
          )}
        </div>

        {/* Name / Edit Mode */}
        {isEditing ? (
          <div className="w-full space-y-3">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-3 py-2 text-sm bg-[#1A1A24] border border-purple-500 rounded-xl text-white outline-none text-center font-semibold"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-2 rounded-xl bg-[#232330] hover:bg-[#2d2d3e] text-gray-300 text-xs font-semibold cursor-pointer"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {user?.full_name || "AI Researcher"}
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              {user?.email || "researcher@novamind.ai"}
            </p>
          </>
        )}

        {message && (
          <div className="mt-3 text-xs text-green-400 font-medium">
            {message}
          </div>
        )}

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
            <p className="text-xs text-gray-500">Account Type</p>
            <p className="text-sm font-semibold text-purple-400 capitalize mt-0.5">
              {user?.auth_provider || "Local"}
            </p>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              setFullName(user?.full_name || "");
              setIsEditing(true);
            }}
            className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-xl
            bg-gradient-to-r from-purple-600 to-fuchsia-500
            hover:from-purple-500 hover:to-fuchsia-400
            transition-all duration-300
            text-white font-semibold text-sm cursor-pointer shadow-md"
          >
            <Edit2 size={14} />
            <span>Edit Profile</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfileCard;