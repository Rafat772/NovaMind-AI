import React, { useState } from "react";
import { Lock, Mail, LogOut, Check, X, Loader2, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import authService from "../../services/authService";

function AccountSettings() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!currentPassword) {
      setErrorMsg("Please enter your current password.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setSuccessMsg("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setSuccessMsg("");
        setShowPasswordModal(false);
      }, 2500);
    } catch (err) {
      console.error("Change password error:", err);
      setErrorMsg(err?.response?.data?.detail || "Failed to change password. Please check your current password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#2D2D38] bg-[#111118] p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Account Settings</h2>
        <p className="text-xs text-gray-400 mt-1">Manage your credentials, security, and session</p>
      </div>

      <div className="space-y-4">
        {/* Change Password Button */}
        {user?.auth_provider === "google" ? (
          <div className="p-4 rounded-xl bg-[#1A1A22] border border-[#2D2D38] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock size={20} className="text-gray-500" />
              <div>
                <span className="text-gray-300 font-medium text-sm block">Password Managed by Google</span>
                <span className="text-xs text-gray-500">You signed in with Google OAuth</span>
              </div>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold">
              Google Account
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setErrorMsg("");
              setSuccessMsg("");
              setShowPasswordModal(true);
            }}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-[#1A1A22] border border-transparent hover:border-purple-500/50 hover:bg-[#242430] text-white transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <KeyRound size={20} className="text-purple-400" />
              <div className="text-left">
                <span className="text-white font-medium text-sm block">Change Password</span>
                <span className="text-xs text-gray-500">Update your secret credentials</span>
              </div>
            </div>
            <span className="text-xs text-purple-400 font-medium">Update</span>
          </button>
        )}

        {/* Email Info */}
        <div className="w-full flex items-center justify-between p-4 rounded-xl bg-[#1A1A22] border border-[#2D2D38] text-white">
          <div className="flex items-center gap-3">
            <Mail size={20} className="text-purple-400" />
            <div className="text-left">
              <span className="text-white font-medium text-sm block">Email Address</span>
              <span className="text-xs text-gray-400">{user?.email || "No email available"}</span>
            </div>
          </div>
          <span className="text-xs text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
            Verified
          </span>
        </div>

        {/* Sign Out */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 font-medium text-sm transition-all cursor-pointer"
        >
          <LogOut size={16} />
          <span>Sign Out of NovaMind AI</span>
        </button>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#14141E] border border-[#2D2D38] rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#2D2D38] mb-4">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <KeyRound size={18} className="text-purple-400" />
                <span>Change Password</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E16] border border-[#2D2D38] text-white text-sm outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E16] border border-[#2D2D38] text-white text-sm outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E0E16] border border-[#2D2D38] text-white text-sm outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-400 flex items-center gap-2">
                  <Check size={14} />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#232330] hover:bg-[#2d2d3e] text-gray-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-semibold cursor-pointer disabled:opacity-50 shadow-md shadow-purple-600/30"
                >
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin text-white" />
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountSettings;