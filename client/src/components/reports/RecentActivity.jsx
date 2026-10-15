import { CheckCircle2, MessageSquare, Clock, ArrowUpRight, FolderOpen } from "lucide-react";

function formatRelativeTime(isoString) {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  } catch {
    return "";
  }
}

function RecentActivity({ recentActivity = [] }) {
  return (
    <div className="rounded-3xl border border-[#2D2D38] bg-[#111118] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Clock size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Live Activity Timeline
              </h2>
              <p className="text-xs text-gray-400">
                Chronological record of document indexing and research conversations
              </p>
            </div>
          </div>
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FolderOpen size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-xs">No research activity recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((item) => {
              const isUpload = item.type === "upload";
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3.5 p-3 rounded-2xl bg-[#151520]/60 border border-[#252535] hover:border-purple-500/30 transition-all group"
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
                      isUpload
                        ? "bg-purple-600/15 text-purple-400 border-purple-500/30"
                        : "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
                    }`}
                  >
                    {isUpload ? <CheckCircle2 size={16} /> : <MessageSquare size={16} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-purple-300 transition-colors">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-gray-500 shrink-0">
                        {formatRelativeTime(item.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-[#222230] text-[11px] text-gray-500 flex justify-between">
        <span>Synchronized with MongoDB events</span>
        <span>{recentActivity.length} events logged</span>
      </div>
    </div>
  );
}

export default RecentActivity;