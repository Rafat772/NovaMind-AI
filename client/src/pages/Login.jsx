import LoginForm from "../components/auth/LoginForm";

function Login() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-purple-600 rounded-full blur-[180px] opacity-20 -top-32 -left-20"></div>

      <div className="absolute w-96 h-96 bg-violet-500 rounded-full blur-[180px] opacity-20 bottom-0 right-0"></div>

      <div className="relative z-10 min-h-screen flex">

        {/* Left Side */}
        <div className="w-1/2 flex items-center justify-center">

          <div>

            <h1 className="text-6xl font-bold text-white">
              NovaMind
              <span className="text-purple-500"> AI</span>
            </h1>

            <p className="mt-8 text-gray-400 text-2xl leading-relaxed max-w-md">
              Research Smarter.
              <br />
              Think Deeper.
            </p>

          </div>

        </div>

        {/* Right Side */}

        <div className="w-1/2 flex items-center justify-center">

          <LoginForm />

        </div>

      </div>

    </div>
  );
}

export default Login;