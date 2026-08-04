import UploadCard from "../components/documents/UploadCard";
import DocumentList from "../components/documents/DocumentList";

function Documents() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white p-10">

      <h1 className="text-4xl font-bold mb-3">
        Documents
      </h1>

      <p className="text-gray-400 mb-10">
        Upload, organize and manage your knowledge base.
      </p>

      <UploadCard />

      <DocumentList />

    </div>
  );
}

export default Documents;