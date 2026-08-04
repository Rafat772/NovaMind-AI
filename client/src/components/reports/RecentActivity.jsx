import { CheckCircle } from "lucide-react";

function RecentActivity() {
  return (
    <div className="rounded-2xl border border-[#2D2D38] bg-[#111118] p-6">

      <h2 className="text-2xl font-semibold text-white mb-6">
        Recent Activity
      </h2>

      <div className="space-y-5">

        <div className="flex items-center gap-3">
          <CheckCircle className="text-green-400" size={20} />
          <p className="text-gray-300">
            AI_Research.pdf uploaded successfully
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CheckCircle className="text-green-400" size={20} />
          <p className="text-gray-300">
            Machine_Learning_Notes.pdf indexed
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CheckCircle className="text-green-400" size={20} />
          <p className="text-gray-300">
            New chat created
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CheckCircle className="text-green-400" size={20} />
          <p className="text-gray-300">
            Weekly report generated
          </p>
        </div>

      </div>

    </div>
  );
}

export default RecentActivity;