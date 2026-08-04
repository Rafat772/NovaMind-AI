import DashboardLayout from "../layouts/DashboardLayout";

import UploadCard from "../components/documents/UploadCard";
import DocumentList from "../components/documents/DocumentList";

function Documents() {
  return (
    <DashboardLayout>
      <div className="p-10">

        <h1 className="text-4xl font-bold text-white mb-3">
          Documents
        </h1>

        <p className="text-gray-400 mb-10">
          Upload, organize and manage your knowledge base.
        </p>

        <UploadCard />

        <DocumentList />

      </div>
    </DashboardLayout>
  );
}

export default Documents;