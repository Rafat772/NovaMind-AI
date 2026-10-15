import { useState, useRef } from "react";
import { UploadCloud, FileCheck, AlertCircle, Loader2, Sparkles } from "lucide-react";
import documentService from "../../services/documentService";

const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt", ".md"];
const MAX_FILE_SIZE_MB = 25;

function UploadCard({ onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileName, setCurrentFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file) return "No file selected.";

    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `Unsupported file format. Please upload PDF, DOCX, TXT, or MD files.`;
    }

    const sizeInMb = file.size / (1024 * 1024);
    if (sizeInMb > MAX_FILE_SIZE_MB) {
      return `File size (${sizeInMb.toFixed(1)}MB) exceeds the ${MAX_FILE_SIZE_MB}MB limit.`;
    }

    return null;
  };

  const handleUpload = async (file) => {
    setErrorMsg("");
    setSuccessMsg("");

    const error = validateFile(file);
    if (error) {
      setErrorMsg(error);
      return;
    }

    try {
      setIsUploading(true);
      setCurrentFileName(file.name);
      setUploadProgress(10);

      const uploadedDoc = await documentService.uploadDocument(file, (progress) => {
        setUploadProgress(progress);
      });

      setUploadProgress(100);
      setSuccessMsg(
        `"${uploadedDoc.filename}" successfully parsed into ${uploadedDoc.chunk_count} chunks!`
      );

      if (onUploadSuccess) {
        onUploadSuccess(uploadedDoc);
      }

      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Clear success notification after 5 seconds
      setTimeout(() => {
        setSuccessMsg("");
      }, 5000);
    } catch (err) {
      const detail =
        err.response?.data?.detail || "Upload failed. Please try again.";
      setErrorMsg(detail);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (isUploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  return (
    <div className="mb-10">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-3xl border transition-all duration-300 p-8 sm:p-10 ${
          isDragging
            ? "border-purple-500 bg-purple-950/20 shadow-2xl shadow-purple-500/10 scale-[1.01]"
            : "border-[#2D2D38] bg-[#111118]/80 hover:border-[#3E3E50]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          
          {/* Animated Icon badge */}
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 ${
              isUploading
                ? "bg-purple-600/30 text-purple-400 animate-pulse"
                : isDragging
                ? "bg-purple-500 text-white scale-110"
                : "bg-purple-600/20 text-purple-400 group-hover:scale-105"
            }`}
          >
            {isUploading ? (
              <Loader2 size={38} className="animate-spin text-purple-400" />
            ) : (
              <UploadCloud size={40} />
            )}
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span>Upload Research Documents</span>
            <Sparkles size={20} className="text-purple-400 animate-pulse" />
          </h2>

          <p className="text-gray-400 text-sm max-w-md mb-6 leading-relaxed">
            Drag and drop your research papers, notes, or knowledge sources here,
            or click to browse files.
          </p>

          {/* Format pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#161622] text-rose-300 border border-rose-500/20">
              PDF
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#161622] text-blue-300 border border-blue-500/20">
              DOCX
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#161622] text-emerald-300 border border-emerald-500/20">
              TXT / Markdown
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#161622] text-gray-400 border border-[#2D2D38]">
              Up to 25 MB
            </span>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-8 py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-purple-600 to-fuchsia-500
              hover:from-purple-500 hover:to-fuchsia-400
              active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
              shadow-lg shadow-purple-600/25 hover:shadow-purple-500/40
              transition-all duration-300 cursor-pointer"
          >
            {isUploading ? "Processing Document..." : "Choose Files"}
          </button>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="w-full max-w-md mt-6 animate-in fade-in">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span className="truncate max-w-[250px] font-medium text-white">
                  {currentFileName}
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#1F1F2C] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-purple-300/80 mt-2">
                Extracting text & creating semantic chunks for AI search...
              </p>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && !isUploading && (
            <div className="mt-6 flex items-center gap-3 px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm animate-in fade-in">
              <FileCheck size={18} className="shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && !isUploading && (
            <div className="mt-6 flex items-center gap-3 px-5 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm animate-in fade-in">
              <AlertCircle size={18} className="shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default UploadCard;