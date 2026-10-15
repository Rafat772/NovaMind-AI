import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import Loader from "../common/Loader";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex flex-col items-center justify-center gap-4">
        <Loader size="lg" />
        <p className="text-gray-400 text-sm">Authenticating NovaMind AI...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
