import Loader from "./Loader";

function Button({
  children,
  type = "button",
  variant = "primary",
  isLoading = false,
  disabled = false,
  onClick,
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary:
      "bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-500 text-white hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(168,85,247,0.45)] active:scale-95 py-3 px-6",
    secondary:
      "bg-[#1A1A22] text-white hover:bg-[#242430] border border-[#2D2D38] hover:border-purple-500/50 py-3 px-6",
    outline:
      "border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 py-3 px-6",
    danger:
      "bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white py-3 px-6",
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader size="sm" />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
