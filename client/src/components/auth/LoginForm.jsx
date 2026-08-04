import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div
      className="w-full max-w-md rounded-3xl
  border border-white/10
  bg-white/5
  backdrop-blur-2xl
  shadow-[0_0_40px_rgba(139,92,246,0.15)]
  p-8"
    >
      <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>

      <p className="text-gray-400 mb-8">Sign in to continue to NovaMind AI</p>

      {/* Email */}

      <div className="mb-5">
        <label className="block text-sm text-gray-300 mb-2">Email</label>

        <div
          className="flex items-center rounded-xl bg-[#111118]
  border border-[#2D2D38]
  focus-within:border-purple-500
  focus-within:shadow-[0_0_10px_rgba(139,92,246,0.4)]
  transition-all duration-300
  px-4"
        >
          <Mail size={18} className="text-gray-400" />

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full bg-transparent px-3 py-3 text-white outline-none"
          />
        </div>
      </div>

      {/* Password */}

      <div className="mb-8">
        <label className="block text-sm text-gray-300 mb-2">Password</label>

        <div
          className="flex items-center rounded-xl bg-[#111118]
  border border-[#2D2D38]
  focus-within:border-purple-500
  focus-within:shadow-[0_0_10px_rgba(139,92,246,0.4)]
  transition-all duration-300
  px-4"
        >
          <Lock size={18} className="text-gray-400" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full bg-transparent px-3 py-3 text-white outline-none"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-purple-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
          <input type="checkbox" className="accent-purple-600" />
          Remember Me
        </label>

        <button
          type="button"
          className="text-sm text-purple-400 hover:text-purple-300  hover:underline transition"
        >
          Forgot Password?
        </button>
      </div>

      <button
        className="w-full rounded-xl py-3 font-semibold text-white
  bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-500
  hover:scale-[1.02]
  hover:shadow-[0_0_25px_rgba(168,85,247,0.45)]
  active:scale-95
  transition-all duration-300
  cursor-pointer"
      >
        Sign In
      </button>
    </div>
  );
}

export default LoginForm;
