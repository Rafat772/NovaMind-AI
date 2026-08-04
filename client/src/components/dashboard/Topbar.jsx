import { Bell, UserCircle } from "lucide-react";

function Topbar() {
  return (
    <div className="h-20 border-b border-[#2D2D38] flex items-center justify-between px-8">

      <div>
        <h2 className="text-2xl font-bold text-white">
          Welcome Back 👋
        </h2>

        <p className="text-gray-400">
          Ready to start a new research?
        </p>
      </div>

      <div className="flex items-center gap-5">

        <Bell
          size={22}
          className="text-gray-400 hover:text-purple-400 cursor-pointer transition"
        />

        <UserCircle
          size={34}
          className="text-purple-400 cursor-pointer"
        />

      </div>

    </div>
  );
}

export default Topbar;