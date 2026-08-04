import { Sparkles } from "lucide-react";

function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center h-full">

      <div className="w-20 h-20 rounded-full bg-purple-600/20 flex items-center justify-center mb-6">
        <Sparkles size={38} className="text-purple-400" />
      </div>

      <h1 className="text-5xl font-bold text-white mb-4">
        Welcome to NovaMind AI
      </h1>

      <p className="text-gray-400 text-xl text-center max-w-2xl">
        Start a new conversation, upload documents, or search the web to
        accelerate your research.
      </p>

    </div>
  );
}

export default Welcome;