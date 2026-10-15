import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import ReportsOverview from "../components/reports/ReportsOverview";
import ActivityChart from "../components/reports/ActivityChart";
import RecentActivity from "../components/reports/RecentActivity";
import ReportModal from "../components/reports/ReportModal";
import reportService from "../services/reportService";
import { Sparkles, FileDown, RefreshCw, Loader2 } from "lucide-react";

function Reports() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportModalData, setReportModalData] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await reportService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      const report = await reportService.generateReport({
        title: "NovaMind AI Knowledge Base Literature Report",
      });
      setReportModalData(report);
    } catch (err) {
      console.error("Failed to generate report:", err);
      alert("Failed to generate report. Please ensure your backend is connected.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 sm:p-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Research Analytics & Reports
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Track knowledge base growth, weekly research cadence, and generate executive reports.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={fetchAnalytics}
              title="Refresh Analytics"
              className="p-2.5 rounded-xl bg-[#14141E] border border-[#2D2D38] text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>

            <button
              type="button"
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-xs sm:text-sm
                bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-600
                hover:from-purple-500 hover:to-fuchsia-500
                shadow-lg shadow-purple-600/30 active:scale-95 disabled:opacity-50 cursor-pointer transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Synthesizing Report...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate Synthesis Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Overview Metrics Cards */}
        <ReportsOverview overview={analytics?.overview || {}} />

        {/* Charts & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <ActivityChart weeklyActivity={analytics?.weekly_activity || []} />
          <RecentActivity recentActivity={analytics?.recent_activity || []} />
        </div>

        {/* Synthesis Report Preview & Export Modal */}
        {reportModalData && (
          <ReportModal
            report={reportModalData}
            onClose={() => setReportModalData(null)}
          />
        )}

      </div>
    </DashboardLayout>
  );
}

export default Reports;