/**
 * ArticlePreview — mirrors the live ArticlePage exactly.
 * Same hero overlay, same meta row (author / date / read time),
 * no excerpt in the header, correct author name from form or user.
 */
import { useEffect } from "react";
import { ArrowLeft, Calendar, CheckCircle, Clock, User, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { resolveApiAssetUrl } from "@/lib/api";

/* ─── Reading time estimate ──────────────────────────────── */
function readingTime(blocks) {
  if (!Array.isArray(blocks)) return 1;
  const words = blocks.flatMap(b => {
    if (b.type === "bullets" || b.type === "numbered") return (b.items || []);
    if (b.type === "image") return [b.caption || ""];
    return [b.text || ""];
  }).join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/* ─── Inline bold/italic renderer ───────────────────────── */
function InlineText({ text }) {
  if (!text) return null;
  // Convert legacy markdown **bold** and _italic_ to HTML tags
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ─── Block renderers (exact match to ArticlePage) ──────── */
function PreviewBlock({ block }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p style={{ fontSize: "1rem", color: "#374151", lineHeight: 1.85, marginBottom: "1.25rem" }}>
          <InlineText text={block.text} />
        </p>
      );
    case "heading":
      return (
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginTop: "2rem", marginBottom: "0.875rem", paddingLeft: "0.875rem", borderLeft: "3px solid #4F7B44" }}>
          <InlineText text={block.text} />
        </h2>
      );
    case "subheading":
      return (
        <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1F2937", margin: "1.5rem 0 0.5rem" }}>
          <InlineText text={block.text} />
        </h3>
      );
    case "image":
      return block.url ? (
        <figure style={{ margin: "1.75rem 0" }}>
          <img loading="lazy" src={resolveApiAssetUrl(block.url)} alt={block.alt || ""}
            style={{ width: "100%", borderRadius: "0.75rem", display: "block", border: "1px solid #E5E7EB" }} />
          {block.caption && (
            <figcaption style={{ textAlign: "center", fontSize: "0.8125rem", color: "#9CA3AF", marginTop: "0.5rem", fontStyle: "italic" }}>
              {block.caption}
            </figcaption>
          )}
        </figure>
      ) : null;
    case "quote":
      return (
        <blockquote style={{ borderLeft: "4px solid #4F7B44", margin: "1.5rem 0", padding: "0.875rem 1.25rem", fontStyle: "italic", color: "#374151", background: "#F9FAFB", borderRadius: "0 0.625rem 0.625rem 0" }}>
          <InlineText text={block.text} />
        </blockquote>
      );
    case "bullets":
      return (
        <ul style={{ margin: "0.5rem 0 1.25rem", paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {(block.items || []).map((item, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
              <CheckCircle size={16} style={{ color: "#4F7B44", flexShrink: 0, marginTop: 3 }} />
              <span style={{ fontSize: "0.9375rem", color: "#374151", lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ul>
      );
    case "numbered":
      return (
        <ol style={{ margin: "0.5rem 0 1.25rem", paddingLeft: "1.5rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {(block.items || []).map((item, i) => (
            <li key={i} style={{ fontSize: "0.9375rem", color: "#374151", lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ol>
      );
    case "callout": {
      const variants = { info: { bg: "#EFF6FF", border: "#BFDBFE", icon: "💡" }, tip: { bg: "#F0FDF4", border: "#BBF7D0", icon: "✅" }, warning: { bg: "#FFFBEB", border: "#FDE68A", icon: "⚠️" } };
      const v = variants[block.variant || "info"];
      return (
        <div style={{ background: v.bg, border: `1px solid ${v.border}`, borderRadius: "0.625rem", padding: "1rem 1.25rem", margin: "1rem 0", display: "flex", gap: "0.75rem" }}>
          <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{v.icon}</span>
          <p style={{ margin: 0, fontSize: "0.9375rem", color: "#374151", lineHeight: 1.7 }}>
            <InlineText text={block.text} />
          </p>
        </div>
      );
    }
    case "conclusion":
      return (
        <div style={{ background: "#4F7B44", borderRadius: "0.75rem", padding: "1.5rem 1.75rem", margin: "1.5rem 0" }}>
          <p style={{ margin: 0, fontSize: "1rem", color: "white", lineHeight: 1.8 }}>
            <InlineText text={block.text} />
          </p>
        </div>
      );
    case "divider":
      return <hr style={{ border: "none", borderTop: "1px solid #E5E7EB", margin: "2rem 0" }} />;
    default:
      return null;
  }
}

/* ─── Main Preview Modal ─────────────────────────────────── */
export default function ArticlePreview({ form, blocks, onClose }) {
  const { user } = useAuth();
  const safeBlocks = Array.isArray(blocks) ? blocks : [];
  const minutes = readingTime(safeBlocks);
  const authorName = user?.name || "RUGAN Team";
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const coverImage = resolveApiAssetUrl(form.coverImage) || "/images/blog/hero.jpg";

  // Lock scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Close on Escape
  useEffect(() => {
    function handle(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [onClose]);

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "1.5rem 1rem 4rem" }}>

      <div style={{ width: "100%", maxWidth: 860, background: "white", borderRadius: "1rem", boxShadow: "0 32px 80px rgba(0,0,0,0.25)", overflow: "hidden" }}>

        {/* Preview bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 1.25rem", background: "#101828", borderBottom: "1px solid #1D2939" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#4F7B44", background: "#E8F2E6", padding: "2px 10px", borderRadius: "9999px" }}>
              Preview
            </span>
            <span style={{ fontSize: "0.8rem", color: "#6B7280" }}>
              This is how your article will appear to readers
            </span>
          </div>
          <button type="button" onClick={onClose}
            style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #374151", borderRadius: "0.5rem", background: "transparent", cursor: "pointer", color: "#9CA3AF" }}>
            <X size={15} />
          </button>
        </div>

        {/* ── Hero (mirrors live ArticlePage hero) ─────────── */}
        <div style={{ position: "relative", minHeight: 280, overflow: "hidden" }}>
          <img loading="lazy" src={coverImage} alt={form.title || ""}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={e => { e.target.style.background = "#3d6235"; e.target.style.opacity = 0; }} />
          {/* Dark overlay — same as live */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(10,25,10,0.72)" }} />

          <div style={{ position: "relative", zIndex: 10, padding: "3rem 2.5rem 2rem" }}>
            {/* Back button (decorative in preview) */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "rgba(255,255,255,0.7)", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
              <ArrowLeft size={14} /> Back to Blog
            </div>

            {/* Title */}
            <h1 style={{ fontSize: "clamp(1.375rem, 3.5vw, 2.125rem)", fontWeight: 700, color: "white", maxWidth: "52rem", lineHeight: 1.25, marginBottom: "1.25rem" }}>
              {form.title || <span style={{ opacity: 0.4 }}>Untitled article</span>}
            </h1>

            {/* Meta row — author / date / read time */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "center" }}>
              {[
                { key: "author", icon: User, text: authorName },
                { key: "date",   icon: Calendar, text: today },
                { key: "time",   icon: Clock, text: `${minutes} min read` },
              ].map(({ key, icon: Icon, text }) => (
                <span key={key} style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "rgba(255,255,255,0.8)", fontSize: "0.875rem" }}>
                  <Icon size={14} /> {text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Article body ────────────────────────────────── */}
        <div style={{ padding: "2.5rem 3rem 3rem", maxWidth: 760, margin: "0 auto", fontFamily: "inherit" }}>

          {/* Tags */}
          {Array.isArray(form.tags) && form.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "1.75rem" }}>
              {form.tags.map(tag => (
                <span key={tag} style={{ padding: "2px 10px", borderRadius: "9999px", background: "#E8F2E6", color: "#3d6235", fontSize: "0.75rem", fontWeight: 500 }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Blocks */}
          {safeBlocks.length === 0 ? (
            <p style={{ color: "#D1D5DB", fontStyle: "italic" }}>No content yet — add some blocks in the editor.</p>
          ) : (
            safeBlocks.map((block, i) => <PreviewBlock key={block.id || i} block={block} />)
          )}
        </div>
      </div>
    </div>
  );
}
