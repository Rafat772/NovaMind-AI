import { Activity, Calendar } from "lucide-react";

function ActivityChart({ weeklyActivity = [] }) {
  // If no data passed, fallback to standard days
  const data = weeklyActivity.length > 0 ? weeklyActivity : [
    { day: "Monday", count: 0, percentage: 0 },
    { day: "Tuesday", count: 0, percentage: 0 },
    { day: "Wednesday", count: 0, percentage: 0 },
    { day: "Thursday", count: 0, percentage: 0 },
    { day: "Friday", count: 0, percentage: 0 },
    { day: "Saturday", count: 0, percentage: 0 },
    { day: "Sunday", count: 0, percentage: 0 },
  ];

  const totalActions = data.reduce((acc, d) => acc + (d.count || 0), 0);

  return (
    <div className="rounded-3xl border border-[#2D2D38] bg-[#111118] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Activity size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Weekly Research Activity
              </h2>
              <p className="text-xs text-gray-400">
                Aggregated document ingestions, chunkings & research syntheses
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
            {totalActions} actions this week
          </span>
        </div>

        <div className="space-y-4">
          {data.map((item, idx) => (
            <div key={idx} className="group">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-300 font-medium group-hover:text-purple-300 transition-colors">
                  {item.day}
                </span>
                <span className="text-gray-400 group-hover:text-white transition-colors">
                  {item.count} {item.count === 1 ? "action" : "actions"} ({item.percentage}%)
                </span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-[#181822] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 transition-all duration-500 group-hover:brightness-110"
                  style={{ width: `${Math.max(item.percentage, item.count > 0 ? 8 : 0)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#222230] flex items-center justify-between text-[11px] text-gray-500">
        <span>Activity is updated in real-time</span>
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          Current Week
        </span>
      </div>
    </div>
  );
}

export default ActivityChart;