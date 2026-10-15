import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import Loader from "../common/Loader";
import GoogleAuthButton from "./GoogleAuthButton";

function LoginForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (isRegister) {
      if (!formData.fullName.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isRegister) {
        await register({
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password,
        });
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        });
      }
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        (isRegister
          ? "Registration failed. Please check your details."
          : "Invalid email or password. Please try again.");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleGoogleSuccess = async (credential) => {
    try {
      setIsLoading(true);
      setError("");
      await googleLogin(credential);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.detail || "Google authentication failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (err) => {
    setError(err?.message || "Google sign-in could not be completed.");
  };

  return (
    <div
      className="w-full max-w-md rounded-3xl
      border border-white/10
      bg-white/5
      backdrop-blur-2xl
      shadow-[0_0_40px_rgba(139,92,246,0.15)]
      p-8 transition-all"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-3xl font-bold text-white">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>
      </div>

      <p className="text-gray-400 mb-6 text-sm">
        {isRegister
          ? "Join NovaMind AI and accelerate your research"
          : "Sign in to access your AI knowledge base"}
      </p>

      {/* Mode switcher tabs */}
      <div className="flex p-1 bg-[#111118] border border-[#2D2D38] rounded-xl mb-6">
        <button
          type="button"
          onClick={() => {
            if (isRegister) toggleMode();
          }}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
            !isRegister
              ? "bg-purple-600 text-white shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isRegister) toggleMode();
          }}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
            isRegister
              ? "bg-purple-600 text-white shadow-md"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Google Sign-In / Sign-Up Button */}
      <div className="mb-6">
        <GoogleAuthButton
          isRegister={isRegister}
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
      </div>

      {/* Or Divider */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="border-t border-[#2D2D38] w-full" />
        <span className="bg-[#12121c] px-3 text-[11px] uppercase tracking-wider text-gray-500 font-semibold absolute">
          Or continue with email
        </span>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-5 flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name for Registration */}
        {isRegister && (
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Full Name
            </label>
            <div
              className="flex items-center rounded-xl bg-[#111118]
              border border-[#2D2D38]
              focus-within:border-purple-500
              focus-within:shadow-[0_0_10px_rgba(139,92,246,0.4)]
              transition-all duration-300
              px-4"
            >
              <User size={18} className="text-gray-400 shrink-0" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Dr. Jane Doe"
                className="w-full bg-transparent px-3 py-3 text-white outline-none text-sm placeholder:text-gray-600"
                required={isRegister}
              />
            </div>
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Email Address
          </label>
          <div
            className="flex items-center rounded-xl bg-[#111118]
            border border-[#2D2D38]
            focus-within:border-purple-500
            focus-within:shadow-[0_0_10px_rgba(139,92,246,0.4)]
            transition-all duration-300
            px-4"
          >
            <Mail size={18} className="text-gray-400 shrink-0" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@organization.com"
              className="w-full bg-transparent px-3 py-3 text-white outline-none text-sm placeholder:text-gray-600"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1.5">
            Password
          </label>
          <div
            className="flex items-center rounded-xl bg-[#111118]
            border border-[#2D2D38]
            focus-within:border-purple-500
            focus-within:shadow-[0_0_10px_rgba(139,92,246,0.4)]
            transition-all duration-300
            px-4"
          >
            <Lock size={18} className="text-gray-400 shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isRegister ? "Minimum 6 characters" : "••••••••"}
              className="w-full bg-transparent px-3 py-3 text-white outline-none text-sm placeholder:text-gray-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-purple-400 transition"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password for Register */}
        {isRegister && (
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Confirm Password
            </label>
            <div
              className="flex items-center rounded-xl bg-[#111118]
              border border-[#2D2D38]
              focus-within:border-purple-500
              focus-within:shadow-[0_0_10px_rgba(139,92,246,0.4)]
              transition-all duration-300
              px-4"
            >
              <Lock size={18} className="text-gray-400 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="w-full bg-transparent px-3 py-3 text-white outline-none text-sm placeholder:text-gray-600"
                required={isRegister}
              />
            </div>
          </div>
        )}

        {/* Remember me and forgot password (only in Sign In mode) */}
        {!isRegister && (
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="accent-purple-600 rounded"
              />
              Remember Me
            </label>

            <button
              type="button"
              onClick={() =>
                alert(
                  "Password reset instructions will be sent to your email."
                )
              }
              className="text-xs text-purple-400 hover:text-purple-300 hover:underline transition"
            >
              Forgot Password?
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 rounded-xl py-3 font-semibold text-white
          bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-500
          hover:scale-[1.01]
          hover:shadow-[0_0_25px_rgba(168,85,247,0.45)]
          active:scale-95
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-all duration-300
          cursor-pointer flex items-center justify-center gap-2 text-sm"
        >
          {isLoading ? (
            <>
              <Loader size="sm" />
              <span>{isRegister ? "Creating Account..." : "Signing In..."}</span>
            </>
          ) : isRegister ? (
            "Create Account"
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Switch mode footer */}
      <div className="mt-6 text-center text-xs text-gray-400">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2 ml-1 cursor-pointer"
            >
              Sign In
            </button>
          </>
        ) : (
          <>
            Don't have an account yet?{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2 ml-1 cursor-pointer"
            >
              Sign Up Free
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginForm;
