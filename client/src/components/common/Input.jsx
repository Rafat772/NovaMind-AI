function Input({
  label,
  icon: Icon,
  error,
  type = "text",
  className = "",
  rightElement,
  ...props
}) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm text-gray-300 mb-2">{label}</label>}

      <div
        className={`flex items-center rounded-xl bg-[#111118] border transition-all duration-300 px-4 ${
          error
            ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
            : "border-[#2D2D38] focus-within:border-purple-500 focus-within:shadow-[0_0_10px_rgba(139,92,246,0.4)]"
        }`}
      >
        {Icon && <Icon size={18} className="text-gray-400 shrink-0" />}

        <input
          type={type}
          className={`w-full bg-transparent px-3 py-3 text-white outline-none placeholder:text-gray-500 ${className}`}
          {...props}
        />

        {rightElement}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default Input;
