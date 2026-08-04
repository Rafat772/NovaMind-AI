import { FileText, CheckCircle } from "lucide-react";

function DocumentCard({ name, status, size, date }) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-[#111118] border border-[#2D2D38] hover:border-purple-500 transition-all duration-300">

      <div className="flex items-center gap-4">

        <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center">
          <FileText className="text-purple-400" size={24} />
        </div>

        <div>
          <h3 className="text-white font-semibold">
            {name}
          </h3>

          <p className="text-gray-400 text-sm">
            {size} • {date}
          </p>
        </div>

      </div>

      <div className="flex items-center gap-2 text-green-400">

        <CheckCircle size={18} />

        <span className="text-sm">
          {status}
        </span>

      </div>

    </div>
  );
}

export default DocumentCard;