import { useState } from "react";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Download,
  Layers,
  FileCode,
  FileType,
} from "lucide-react";

function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function formatDate(isoString) {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;

    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return "";
  }
}

function getFileTypeInfo(fileType) {
  const type = (fileType || "").toLowerCase();
  if (type === "pdf") {
    return {
      icon: FileText,
      iconColor: "text-rose-400",
      bgBadge: "bg-rose-500/10 text-rose-300 border-rose-500/30",
      label: "PDF",
    };
  }
  if (type === "docx" || type === "doc") {
    return {
      icon: FileType,
      iconColor: "text-blue-400",
      bgBadge: "bg-blue-500/10 text-blue-300 border-blue-500/30",
      label: "DOCX",
    };
  }
  return {
    icon: FileCode,
    iconColor: "text-emerald-400",
    bgBadge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    label: (fileType || "TXT").toUpperCase(),
  };
}

function DocumentCard({ doc, onViewChunks, onDownload, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const typeInfo = getFileTypeInfo(doc.file_type);
  const IconComponent = typeInfo.icon;

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${doc.filename}"?`)) {
      try {
        setIsDeleting(true);
        await onDelete(doc.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="group relative flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-[#111118] border border-[#2D2D38] hover:border-purple-500/50 hover:bg-[#14141d] transition-all duration-300 gap-4 shadow-lg shadow-black/20">
      
      {/* File Info */}
      <div className="flex items-center gap-4 min-w-0">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${typeInfo.bgBadge}`}
        >
          <IconComponent className={typeInfo.iconColor} size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className="text-white font-semibold text-base truncate max-w-sm sm:max-w-md"
              title={doc.filename}
            >
              {doc.filename}
            </h3>
            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${typeInfo.bgBadge}`}
            >
              {typeInfo.label}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mt-1">
            <span>{formatBytes(doc.file_size)}</span>
            <span>•</span>
            <span>{formatDate(doc.created_at)}</span>

            {doc.page_count > 0 && (
              <>
                <span>•</span>
                <span>{doc.page_count} {doc.page_count === 1 ? "page" : "pages"}</span>
              </>
            )}

            {doc.chunk_count > 0 && (
              <>
                <span>•</span>
                <span className="text-purple-300 font-medium">
                  {doc.chunk_count} chunks indexed
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status & Actions */}
      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#2D2D38]/50">
        
        {/* Status Badge */}
        <div>
          {doc.status === "ready" && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 size={14} />
              <span>Ready</span>
            </div>
          )}

          {doc.status === "processing" && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Loader2 size={14} className="animate-spin" />
              <span>Processing</span>
            </div>
          )}

          {doc.status === "failed" && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20"
              title={doc.error_message || "Processing failed"}
            >
              <AlertCircle size={14} />
              <span>Failed</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* View Chunks button */}
          <button
            type="button"
            onClick={() => onViewChunks(doc)}
            title="Inspect Chunks"
            className="p-2 rounded-xl text-gray-400 hover:text-purple-300 hover:bg-purple-600/10 border border-transparent hover:border-purple-500/20 transition-all cursor-pointer"
          >
            <Layers size={18} />
          </button>

          {/* Download button */}
          <button
            type="button"
            onClick={() => onDownload(doc.id, doc.filename)}
            title="Download Original"
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-[#2D2D38] transition-all cursor-pointer"
          >
            <Download size={18} />
          </button>

          {/* Delete button */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete Document"
            className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 size={18} className="animate-spin text-rose-400" />
            ) : (
              <Trash2 size={18} />
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

export default DocumentCard;