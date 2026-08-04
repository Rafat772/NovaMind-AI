import { UploadCloud } from "lucide-react";

function UploadCard() {
  return (
    <div className="mb-10 rounded-3xl border border-[#2D2D38] bg-[#111118] p-10">

      <div className="flex flex-col items-center justify-center">

        <div className="w-20 h-20 rounded-full bg-purple-600/20 flex items-center justify-center mb-5">
          <UploadCloud size={40} className="text-purple-400" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">
          Upload Documents
        </h2>

        <p className="text-gray-400 text-center max-w-lg mb-8">
          Upload PDF, DOCX or TXT files to build your AI knowledge base.
        </p>

        <button
          className="px-8 py-3 rounded-xl
          bg-gradient-to-r from-purple-600 to-fuchsia-500
          hover:from-purple-500 hover:to-fuchsia-400
          transition-all duration-300
          text-white font-semibold"
        >
          Choose Files
        </button>

      </div>

    </div>
  );
}

export default UploadCard;