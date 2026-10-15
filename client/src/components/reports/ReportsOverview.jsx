import StatsCard from "./StatsCard";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${mb.toFixed(1)} MB`;
}

function ReportsOverview({ overview = {} }) {
  const totalDocs = overview.total_documents || 0;
  const totalChunks = overview.total_chunks || 0;
  const totalSessions = overview.total_sessions || 0;
  const totalMessages = overview.total_messages || 0;
  const totalStorage = formatBytes(overview.total_storage_bytes);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Indexed Literature"
        value={totalDocs.toString()}
        color="text-purple-400"
      />

      <StatsCard
        title="Knowledge Chunks"
        value={totalChunks.toLocaleString()}
        color="text-cyan-400"
      />

      <StatsCard
        title="Research Threads"
        value={totalSessions.toString()}
        color="text-emerald-400"
      />

      <StatsCard
        title="Synthesized Messages"
        value={totalMessages.toLocaleString()}
        color="text-fuchsia-400"
      />
    </div>
  );
}

export default ReportsOverview;