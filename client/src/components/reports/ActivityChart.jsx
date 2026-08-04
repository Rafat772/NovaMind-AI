function ActivityChart() {
  return (
    <div className="rounded-2xl border border-[#2D2D38] bg-[#111118] p-6">

      <h2 className="text-2xl font-semibold text-white mb-6">
        Weekly Activity
      </h2>

      <div className="space-y-4">

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-400">Monday</span>
            <span className="text-white">65%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-[#1D1D27]">
            <div className="h-3 rounded-full bg-purple-500 w-[65%]"></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-400">Tuesday</span>
            <span className="text-white">90%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-[#1D1D27]">
            <div className="h-3 rounded-full bg-purple-500 w-[90%]"></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-400">Wednesday</span>
            <span className="text-white">45%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-[#1D1D27]">
            <div className="h-3 rounded-full bg-purple-500 w-[45%]"></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-400">Thursday</span>
            <span className="text-white">80%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-[#1D1D27]">
            <div className="h-3 rounded-full bg-purple-500 w-[80%]"></div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default ActivityChart;