import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { createPortal } from "react-dom";

const TONES = {
  danger: {
    badgeBg: "#FEF3F2",
    badgeColor: "#B42318",
    confirmBg: "#B42318",
    confirmHoverBg: "#912018",
    confirmBorder: "#B42318",
  },
  neutral: {
    badgeBg: "#F2F4F7",
    badgeColor: "#344054",
    confirmBg: "#101828",
    confirmHoverBg: "#1D2939",
    confirmBorder: "#101828",
  },
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  busy = false,
  onCancel,
  onConfirm,
}) {
  const palette = TONES[tone] || TONES.danger;

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape" && !busy) {
        onCancel?.();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, busy, onCancel]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      onClick={() => {
        if (!busy) onCancel?.();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 11000,
        background: "rgba(16, 24, 40, 0.64)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 460,
          background: "white",
          borderRadius: "1rem",
          boxShadow: "0 32px 80px rgba(16, 24, 40, 0.24)",
          border: "1px solid #EAECF0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1rem",
            padding: "1.25rem 1.25rem 1rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "9999px",
                background: palette.badgeBg,
                color: palette.badgeColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#101828" }}>
                {title}
              </h3>
              {description && (
                <p style={{ margin: "0.375rem 0 0", fontSize: "0.9rem", lineHeight: 1.65, color: "#475467" }}>
                  {description}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            style={{
              width: 32,
              height: 32,
              borderRadius: "0.5rem",
              border: "1px solid #EAECF0",
              background: "white",
              color: "#667085",
              cursor: busy ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <X size={15} />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            padding: "0 1.25rem 1.25rem",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            style={{
              padding: "0.625rem 1rem",
              borderRadius: "0.625rem",
              border: "1px solid #D0D5DD",
              background: "white",
              color: "#344054",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: busy ? "not-allowed" : "pointer",
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            style={{
              padding: "0.625rem 1rem",
              borderRadius: "0.625rem",
              border: `1px solid ${palette.confirmBorder}`,
              background: palette.confirmBg,
              color: "white",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: busy ? "not-allowed" : "pointer",
              transition: "background 150ms ease",
            }}
            onMouseEnter={(event) => {
              if (!busy) event.currentTarget.style.background = palette.confirmHoverBg;
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = palette.confirmBg;
            }}
          >
            {busy ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
