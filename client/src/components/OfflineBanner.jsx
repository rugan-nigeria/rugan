import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Floating banner that appears when the user goes offline and
 * briefly shows a success toast when they come back online.
 * Rendered via portal so it sits above all other UI.
 */
export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      if (wasOffline) {
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 3000);
      }
    }

    function handleOffline() {
      setIsOnline(false);
      setWasOffline(true);
      setShowReconnected(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [wasOffline]);

  if (isOnline && !showReconnected) return null;

  const banner = (
    <>
      <style>{`
        @keyframes offlineSlideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @keyframes offlineFadeOut {
          from { opacity: 1; }
          to   { opacity: 0; transform: translateY(100%); }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 12000,
          background: !isOnline
            ? "linear-gradient(135deg, #B42318, #912018)"
            : "linear-gradient(135deg, #4F7B44, #3d6235)",
          color: "white",
          padding: "0.75rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.625rem",
          fontSize: "0.875rem",
          fontWeight: 500,
          fontFamily: "'Inter', system-ui, sans-serif",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.18)",
          animation: showReconnected
            ? "offlineSlideUp 0.3s ease-out"
            : "offlineSlideUp 0.3s ease-out",
        }}
      >
        {!isOnline ? (
          <>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
              <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
            <span>You are currently offline. Some features may not work.</span>
          </>
        ) : (
          <>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>You're back online!</span>
          </>
        )}
      </div>
    </>
  );

  return typeof document !== "undefined"
    ? createPortal(banner, document.body)
    : null;
}
