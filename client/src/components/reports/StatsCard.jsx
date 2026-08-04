function StatsCard({ title, value, color }) {
  return (
    <div
      className="rounded-2xl border border-[#2D2D38] bg-[#111118] p-6
      hover:border-purple-500 transition-all duration-300"
    >
      <p className="text-gray-400 text-sm mb-2">
        {title}
      </p>

      <h2 className={`text-4xl font-bold ${color}`}>
        {value}
      </h2>
    </div>
  );
}

export default StatsCard;