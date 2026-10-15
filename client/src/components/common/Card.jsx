function Card({ children, className = "", hover = true, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-[#2D2D38] bg-[#111118] p-6 ${
        hover ? "hover:border-purple-500/60 transition-all duration-300" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
