import ReportsOverview from "../components/reports/ReportsOverview";
import ActivityChart from "../components/reports/ActivityChart";
import RecentActivity from "../components/reports/RecentActivity";

function Reports() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white p-10">

      <h1 className="text-4xl font-bold mb-2">
        Reports
      </h1>

      <p className="text-gray-400 mb-10">
        Track your AI usage, documents and research activity.
      </p>

      <ReportsOverview />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        <ActivityChart />

        <RecentActivity />

      </div>

    </div>
  );
}

export default Reports;