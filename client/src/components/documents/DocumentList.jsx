import DocumentCard from "./DocumentCard";

function DocumentList() {
  return (
    <div className="space-y-4">

      <DocumentCard
        name="AI_Research.pdf"
        status="Indexed"
        size="2.4 MB"
        date="Today"
      />

      <DocumentCard
        name="Machine_Learning_Notes.pdf"
        status="Ready"
        size="4.1 MB"
        date="Yesterday"
      />

      <DocumentCard
        name="Resume.pdf"
        status="Processing"
        size="520 KB"
        date="2 Days Ago"
      />

      <DocumentCard
        name="LangGraph_Guide.docx"
        status="Indexed"
        size="1.7 MB"
        date="Last Week"
      />

    </div>
  );
}

export default DocumentList;