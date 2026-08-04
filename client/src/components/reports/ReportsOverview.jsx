import StatsCard from "./StatsCard";

function ReportsOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      <StatsCard
        title="Documents"
        value="24"
        color="text-purple-400"
      />

      <StatsCard
        title="Chats"
        value="182"
        color="text-cyan-400"
      />

      <StatsCard
        title="Searches"
        value="546"
        color="text-green-400"
      />

      <StatsCard
        title="AI Responses"
        value="1,348"
        color="text-pink-400"
      />

    </div>
  );
}

export default ReportsOverview;