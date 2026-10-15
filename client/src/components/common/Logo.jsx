import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function Logo({ size = "md", to = "/dashboard" }) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  };

  return (
    <Link to={to} className="inline-flex items-center gap-2 group">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-violet-400 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.7)] transition-all">
        <Sparkles size={18} className="text-white" />
      </div>
      <span className={`font-bold text-white tracking-tight ${sizeClasses[size] || sizeClasses.md}`}>
        NovaMind <span className="text-purple-400">AI</span>
      </span>
    </Link>
  );
}

export default Logo;
