import { Component } from "react";

/**
 * Checks whether an error is a dynamic-import / chunk-load failure.
 * These surface when the browser can't fetch a lazily-loaded JS chunk,
 * typically because the user lost connectivity or a deploy replaced the
 * hashed filenames.
 */
function isChunkLoadError(error) {
  if (!error) return false;
  const msg = (error.message || "").toLowerCase();
  return (
    msg.includes("failed to fetch dynamically imported module") ||
    msg.includes("loading chunk") ||
    msg.includes("loading css chunk") ||
    msg.includes("dynamically imported module") ||
    msg.includes("failed to fetch") ||
    error.name === "ChunkLoadError"
  );
}

/**
 * Checks whether an error is a network / connectivity issue.
 */
function isNetworkError(error) {
  if (!error) return false;
  const msg = (error.message || "").toLowerCase();
  return (
    msg.includes("network error") ||
    msg.includes("networkerror") ||
    msg.includes("failed to fetch") ||
    msg.includes("load failed") ||
    msg.includes("net::err_") ||
    error.name === "TypeError"
  );
}

/**
 * Returns a user-friendly title + description based on error type.
 */
function getErrorInfo(error) {
  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

  if (isOffline || isChunkLoadError(error)) {
    return {
      icon: "wifi",
      title: "You're offline",
      description:
        "It looks like you've lost your internet connection. Please check your network and try again.",
      actionLabel: "Retry",
    };
  }

  if (isNetworkError(error)) {
    return {
      icon: "cloud",
      title: "Connection problem",
      description:
        "We couldn't reach our servers. This could be a temporary network issue — please try again in a moment.",
      actionLabel: "Retry",
    };
  }

  return {
    icon: "alert",
    title: "Something went wrong",
    description:
      "An unexpected error occurred. We've been notified and are looking into it. Please try refreshing the page.",
    actionLabel: "Refresh page",
  };
}

/* ─── Inline SVG icons (no external dependencies) ─────────────────────── */
function WifiOffIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
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
  );
}

function CloudOffIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6" />
      <path d="M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

const ICON_MAP = {
  wifi: WifiOffIcon,
  cloud: CloudOffIcon,
  alert: AlertIcon,
};

/* ─── Styles (inline for zero-dependency rendering) ───────────────────── */
const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem",
    fontFamily: "'Inter', system-ui, sans-serif",
    background: "linear-gradient(135deg, #f0f7ee 0%, #F9FAFB 50%, #f0f7ee 100%)",
  },
  card: {
    width: "100%",
    maxWidth: 480,
    background: "white",
    borderRadius: "1.25rem",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)",
    border: "1px solid #E5E7EB",
    padding: "2.5rem 2rem",
    textAlign: "center",
    animation: "errorFadeIn 0.4s ease-out",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #FEF3F2 0%, #FFEAE8 100%)",
    color: "#B42318",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1.5rem",
  },
  title: {
    margin: "0 0 0.625rem",
    fontSize: "1.375rem",
    fontWeight: 700,
    color: "#101828",
    lineHeight: 1.3,
  },
  description: {
    margin: "0 0 2rem",
    fontSize: "0.9375rem",
    lineHeight: 1.65,
    color: "#475467",
  },
  buttonRow: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    alignItems: "center",
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    width: "100%",
    maxWidth: 280,
    padding: "0.8rem 1.5rem",
    borderRadius: "0.75rem",
    border: "2px solid #4F7B44",
    background: "#4F7B44",
    color: "white",
    fontSize: "0.9375rem",
    fontWeight: 600,
    fontFamily: "'Inter', system-ui, sans-serif",
    cursor: "pointer",
    transition: "all 200ms ease",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    width: "100%",
    maxWidth: 280,
    padding: "0.7rem 1.5rem",
    borderRadius: "0.75rem",
    border: "1px solid #D0D5DD",
    background: "transparent",
    color: "#344054",
    fontSize: "0.875rem",
    fontWeight: 500,
    fontFamily: "'Inter', system-ui, sans-serif",
    cursor: "pointer",
    transition: "all 200ms ease",
  },
  offlineBanner: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 12000,
    background: "linear-gradient(135deg, #B42318, #912018)",
    color: "white",
    padding: "0.75rem 1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    fontFamily: "'Inter', system-ui, sans-serif",
    boxShadow: "0 -4px 16px rgba(0, 0, 0, 0.15)",
    animation: "slideUp 0.3s ease-out",
  },
  onlineBanner: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 12000,
    background: "linear-gradient(135deg, #4F7B44, #3d6235)",
    color: "white",
    padding: "0.75rem 1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    fontFamily: "'Inter', system-ui, sans-serif",
    boxShadow: "0 -4px 16px rgba(0, 0, 0, 0.15)",
    animation: "slideUp 0.3s ease-out",
  },
};

const cssKeyframes = `
@keyframes errorFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}
@keyframes errorPulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.05); }
}
`;

/* ─── Error Fallback (stateless, used for both ErrorBoundary + errorElement) */
export function ErrorFallback({ error, isRouteError = false }) {
  const info = getErrorInfo(error);
  const IconComponent = ICON_MAP[info.icon] || AlertIcon;

  function handleRetry() {
    // For chunk-load errors, a full reload is the most reliable fix
    // because the browser caches the failed import, and React.lazy
    // won't re-attempt it on a simple re-render.
    window.location.reload();
  }

  function handleGoHome() {
    window.location.href = "/";
  }

  return (
    <>
      <style>{cssKeyframes}</style>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.iconCircle}>
            <IconComponent />
          </div>

          <h1 style={styles.title}>{info.title}</h1>
          <p style={styles.description}>{info.description}</p>

          <div style={styles.buttonRow}>
            <button
              type="button"
              style={styles.primaryButton}
              onClick={handleRetry}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#3d6235";
                e.currentTarget.style.borderColor = "#3d6235";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#4F7B44";
                e.currentTarget.style.borderColor = "#4F7B44";
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              {info.actionLabel}
            </button>

            {isRouteError && (
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={handleGoHome}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#F9FAFB";
                  e.currentTarget.style.borderColor = "#4F7B44";
                  e.currentTarget.style.color = "#4F7B44";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "#D0D5DD";
                  e.currentTarget.style.color = "#344054";
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Go to homepage
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── React Error Boundary (class component) ──────────────────────────── */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console in development for debugging
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
