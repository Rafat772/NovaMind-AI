import { useEffect, useRef, useState } from "react";
import Loader from "../common/Loader";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function GoogleAuthButton({ onSuccess, onError, isRegister = false }) {
  const [isLoading, setIsLoading] = useState(false);
  const [configMissing, setConfigMissing] = useState(false);
  const hiddenBtnRef = useRef(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    const initGsi = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            if (response.credential) {
              try {
                setIsLoading(true);
                await onSuccess(response.credential);
              } catch (err) {
                if (onError) onError(err);
              } finally {
                setIsLoading(false);
              }
            }
          },
        });

        // Render hidden official button so we can programmatically invoke it if needed
        if (hiddenBtnRef.current) {
          window.google.accounts.id.renderButton(hiddenBtnRef.current, {
            type: "standard",
            theme: "outline",
            size: "large",
            width: "100%",
          });
        }
      }
    };

    // If script is already loaded
    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      // Check every 200ms up to 2 seconds for script loading
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initGsi();
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [googleClientId, onSuccess, onError]);

  const handleCustomClick = () => {
    if (!googleClientId) {
      setConfigMissing(true);
      return;
    }

    if (window.google?.accounts?.id) {
      try {
        setIsLoading(true);
        // Trigger Google One Tap / Account picker prompt
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setIsLoading(false);
          }
        });
      } catch {
        setIsLoading(false);
      }
    } else {
      alert("Google Identity Services is still loading. Please try again in a moment.");
    }
  };

  return (
    <div className="w-full">
      {/* Hidden container where GIS can render if needed */}
      <div ref={hiddenBtnRef} className="hidden" />

      {/* Styled Glassmorphic Google Button */}
      <button
        type="button"
        onClick={handleCustomClick}
        disabled={isLoading}
        className="w-full py-3 px-4 rounded-xl font-medium text-white text-sm
          bg-[#111118] border border-[#2D2D38]
          hover:border-purple-500/50 hover:bg-[#161622]
          active:scale-[0.99] transition-all duration-300
          flex items-center justify-center gap-3 cursor-pointer
          shadow-lg shadow-black/20 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader size="sm" />
        ) : (
          <>
            <GoogleIcon />
            <span>
              {isRegister ? "Sign up with Google" : "Sign in with Google"}
            </span>
          </>
        )}
      </button>

      {/* Configuration Helper Alert if Google Client ID is not provided in .env */}
      {configMissing && (
        <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs animate-in fade-in">
          <p className="font-semibold mb-1">Google OAuth Setup Required:</p>
          <p className="text-gray-300">
            Please add your Google Client ID to <code className="text-amber-200 bg-amber-950/40 px-1 py-0.5 rounded">client/.env</code> as:
          </p>
          <p className="font-mono text-[11px] text-amber-200 mt-1 break-all bg-black/40 p-1.5 rounded">
            VITE_GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
          </p>
          <button
            type="button"
            onClick={() => setConfigMissing(false)}
            className="mt-2 text-amber-400 hover:underline font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default GoogleAuthButton;
