import { User } from "lucide-react";

function ProfileCard() {
  return (
    <div className="rounded-2xl border border-[#2D2D38] bg-[#111118] p-8">

      <div className="flex flex-col items-center">

        <div className="w-24 h-24 rounded-full bg-purple-600/20 flex items-center justify-center mb-5">
          <User size={48} className="text-purple-400" />
        </div>

        <h2 className="text-2xl font-bold text-white">
          Rafat Ullah Khan
        </h2>

        <p className="text-gray-400 mt-2">
          AI Researcher
        </p>

        <button
          className="mt-8 px-6 py-3 rounded-xl
          bg-gradient-to-r from-purple-600 to-fuchsia-500
          hover:from-purple-500 hover:to-fuchsia-400
          transition-all duration-300
          text-white font-semibold"
        >
          Edit Profile
        </button>

      </div>

    </div>
  );
}

export default ProfileCard;