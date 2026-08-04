function Preferences() {
  return (
    <div className="rounded-2xl border border-[#2D2D38] bg-[#111118] p-6">

      <h2 className="text-2xl font-semibold text-white mb-6">
        Preferences
      </h2>

      <div className="space-y-5">

        <div className="flex items-center justify-between">
          <span className="text-gray-300">Dark Mode</span>

          <input
            type="checkbox"
            defaultChecked
            className="accent-purple-600"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-300">Notifications</span>

          <input
            type="checkbox"
            defaultChecked
            className="accent-purple-600"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-300">Language</span>

          <select className="bg-[#1A1A22] border border-[#2D2D38] rounded-lg px-3 py-2 text-white">
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>

      </div>

    </div>
  );
}

export default Preferences;