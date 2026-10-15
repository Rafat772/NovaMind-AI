import LoginForm from "../components/auth/LoginForm";
import { Sparkles, BrainCircuit, ShieldCheck, Zap } from "lucide-react";

function Login() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] relative overflow-hidden flex items-center justify-center p-4 lg:p-12">
      {/* Background Glow Accents */}
      <div className="absolute w-96 h-96 bg-purple-600 rounded-full blur-[180px] opacity-25 -top-32 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 bg-violet-500 rounded-full blur-[180px] opacity-20 bottom-0 right-0 pointer-events-none" />
      <div className="absolute w-80 h-80 bg-fuchsia-600 rounded-full blur-[160px] opacity-15 top-1/2 left-1/3 pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Brand Showcase */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-medium mb-6">
            <Sparkles size={16} />
            <span>Next-Gen AI Research Workspace</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            NovaMind <span className="bg-gradient-to-r from-purple-400 via-violet-300 to-fuchsia-400 bg-clip-text text-transparent">AI</span>
          </h1>

          <p className="mt-6 text-gray-300 text-lg lg:text-xl leading-relaxed max-w-lg">
            Research Smarter. Think Deeper. Synthesize complex documents and ask questions with Retrieval-Augmented Intelligence.
          </p>

          {/* Value Props */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <BrainCircuit className="text-purple-400 shrink-0" size={20} />
              <span className="text-sm text-gray-300">Intelligent RAG Engine</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <Zap className="text-purple-400 shrink-0" size={20} />
              <span className="text-sm text-gray-300">Fast Document Ingestion</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <ShieldCheck className="text-purple-400 shrink-0" size={20} />
              <span className="text-sm text-gray-300">Secure & Private Data</span>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <Sparkles className="text-purple-400 shrink-0" size={20} />
              <span className="text-sm text-gray-300">Smart Citations & Reports</span>
            </div>
          </div>
        </div>

        {/* Right Authentication Card */}
        <div className="w-full lg:w-1/2 flex items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default Login;