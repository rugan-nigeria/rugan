import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlignLeft,
  Bold,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Heading2,
  Heading3,
  Image,
  Info,
  Italic,
  List,
  ListOrdered,
  Minus,
  Plus,
  Quote,
  Redo,
  Trash2,
  Undo,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";

import api, { resolveApiAssetUrl } from "@/lib/api";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function makeBlock(type) {
  const base = { id: uid(), type };

  switch (type) {
    case "image":
      return { ...base, url: "", caption: "", alt: "" };
    case "bullets":
    case "numbered":
      return { ...base, items: [""] };
    case "callout":
      return { ...base, text: "", variant: "info" };
    case "conclusion":
      return { ...base, text: "" };
    default:
      return { ...base, text: "" };
  }
}

const BLOCK_META = [
  { type: "paragraph", label: "Paragraph", icon: AlignLeft },
  { type: "heading", label: "Heading", icon: Heading2 },
  { type: "subheading", label: "Subheading", icon: Heading3 },
  { type: "image", label: "Image", icon: Image },
  { type: "quote", label: "Quote", icon: Quote },
  { type: "bullets", label: "Bullet list", icon: List },
  { type: "numbered", label: "Numbered list", icon: ListOrdered },
  { type: "callout", label: "Callout", icon: Info },
  { type: "divider", label: "Divider", icon: Minus },
  { type: "conclusion", label: "Conclusion", icon: Bookmark },
];

const TA = {
  width: "100%",
  border: "none",
  outline: "none",
  resize: "none",
  fontFamily: "inherit",
  background: "transparent",
  padding: 0,
  lineHeight: 1.75,
};

const IL = {
  width: "100%",
  border: "none",
  borderBottom: "1px solid #E5E7EB",
  outline: "none",
  fontFamily: "inherit",
  background: "transparent",
  padding: "4px 0",
  fontSize: "0.875rem",
};

function EditableText({ value, onChange, placeholder, style, as = "div", onKeyDown }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && value !== ref.current.innerHTML) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const emit = () => {
    if (ref.current && ref.current.innerHTML !== value) {
      onChange(ref.current.innerHTML);
    }
  };

  const Tag = as;

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onInput={emit}
      onBlur={emit}
      onKeyDown={onKeyDown}
      style={{
        ...style,
        outline: "none",
        minHeight: "1.5em",
        cursor: "text"
      }}
      data-placeholder={placeholder}
    />
  );
}

function FormatBar() {
  const btnStyle = {
    padding: "3px 7px",
    border: "1px solid #E5E7EB",
    borderRadius: 4,
    background: "white",
    cursor: "pointer",
    fontSize: "0.75rem",
    color: "#111827",
    display: "flex",
    alignItems: "center"
  };

  return (
    <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
      <button
        type="button"
        title="Undo (Ctrl+Z)"
        onMouseDown={e => e.preventDefault()}
        onClick={() => document.execCommand("undo")}
        style={btnStyle}
      >
        <Undo size={13} />
      </button>
      <button
        type="button"
        title="Redo (Ctrl+Y)"
        onMouseDown={e => e.preventDefault()}
        onClick={() => document.execCommand("redo")}
        style={btnStyle}
      >
        <Redo size={13} />
      </button>
      <div style={{ width: 1, background: "#E5E7EB", margin: "0 4px" }} />
      <button
        type="button"
        title="Bold (Ctrl+B)"
        onMouseDown={e => e.preventDefault()}
        onClick={() => document.execCommand("bold")}
        style={{ ...btnStyle, fontWeight: 700 }}
      >
        <Bold size={13} />
      </button>
      <button
        type="button"
        title="Italic (Ctrl+I)"
        onMouseDown={e => e.preventDefault()}
        onClick={() => document.execCommand("italic")}
        style={{ ...btnStyle, fontStyle: "italic" }}
      >
        <Italic size={13} />
      </button>
      <span style={{ fontSize: "0.7rem", color: "#D1D5DB", alignSelf: "center", marginLeft: 4 }}>
        Select text to format
      </span>
    </div>
  );
}

function ParagraphBlock({ block, onChange }) {
  return (
    <>
      <FormatBar />
      <EditableText
        style={{ ...TA, fontSize: "0.9375rem", color: "#111827", minHeight: 28, border: "none" }}
        value={block.text || ""}
        placeholder="Write something..."
        onChange={(val) => onChange({ text: val })}
        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); document.execCommand("insertLineBreak"); } }}
      />
    </>
  );
}

function HeadingBlock({ block, onChange, level = 2 }) {
  const style =
    level === 2
      ? { ...TA, fontSize: "1.25rem", fontWeight: 700, color: "#111827", minHeight: 32, border: "none" }
      : { ...TA, fontSize: "1.05rem", fontWeight: 600, color: "#1F2937", minHeight: 28, border: "none" };

  return (
    <EditableText
      style={style}
      value={block.text || ""}
      placeholder={level === 2 ? "Section heading..." : "Sub-section heading..."}
      onChange={(val) => onChange({ text: val })}
      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); document.execCommand("insertLineBreak"); } }}
    />
  );
}

function QuoteBlock({ block, onChange }) {
  return (
    <div style={{ borderLeft: "4px solid #4F7B44", paddingLeft: "1rem" }}>
      <FormatBar />
      <EditableText
        style={{ ...TA, fontSize: "1.05rem", fontStyle: "italic", color: "#111827", minHeight: 28, border: "none" }}
        value={block.text || ""}
        placeholder="Enter a quote or pull-out text..."
        onChange={(val) => onChange({ text: val })}
        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); document.execCommand("insertLineBreak"); } }}
      />
    </div>
  );
}

function ImageBlock({ block, onChange }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = resolveApiAssetUrl(response.data?.url || response.data?.data?.url);
      onChange({ url });
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <Image size={14} style={{ color: "#9CA3AF", flexShrink: 0 }} />
        <input
          style={{ ...IL, flex: 1 }}
          value={block.url || ""}
          placeholder="Paste image URL (https://...)"
          onChange={(event) => onChange({ url: event.target.value })}
        />
        <span style={{ fontSize: "0.75rem", color: "#9CA3AF", flexShrink: 0 }}>or</span>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "5px 10px",
            border: "1px solid #D0D5DD",
            borderRadius: "0.375rem",
            background: uploading ? "#F9FAFB" : "white",
            cursor: uploading ? "not-allowed" : "pointer",
            fontSize: "0.8rem",
            color: "#344054",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          <Upload size={13} /> {uploading ? "Uploading..." : "Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          style={{ display: "none" }}
          onChange={handleFile}
        />
      </div>

      {block.url && (
        <div
          style={{
            borderRadius: "0.5rem",
            overflow: "hidden",
            border: "1px solid #E5E7EB",
            background: "#F9FAFB",
            maxHeight: 360,
          }}
        >
          <img
            src={resolveApiAssetUrl(block.url)}
            alt={block.alt || "preview"}
            style={{ width: "100%", maxHeight: 360, objectFit: "cover", display: "block" }}
            onError={(event) => {
              event.target.style.display = "none";
            }}
          />
        </div>
      )}

      <input
        style={IL}
        value={block.alt || ""}
        placeholder="Alt text (for accessibility)"
        onChange={(event) => onChange({ alt: event.target.value })}
      />
      <input
        style={{ ...IL, fontSize: "0.8125rem", color: "#6B7280", fontStyle: "italic" }}
        value={block.caption || ""}
        placeholder="Caption (optional)"
        onChange={(event) => onChange({ caption: event.target.value })}
      />
    </div>
  );
}

function ListBlock({ block, onChange, numbered = false }) {
  const items = block.items || [""];

  function updateItem(index, value) {
    const nextItems = [...items];
    nextItems[index] = value;
    onChange({ items: nextItems });
  }

  function addItem(index) {
    const nextItems = [...items];
    nextItems.splice(index + 1, 0, "");
    onChange({ items: nextItems });
  }

  function removeItem(index) {
    if (items.length === 1) return;
    onChange({ items: items.filter((_, itemIndex) => itemIndex !== index) });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      {items.map((item, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              color: "#4F7B44",
              fontWeight: 700,
              fontSize: "0.875rem",
              width: 20,
              flexShrink: 0,
              textAlign: "right",
            }}
          >
            {numbered ? `${index + 1}.` : "\u2022"}
          </span>
          <EditableText
            style={{ ...IL, flex: 1, borderBottom: "none", minHeight: 20 }}
            value={item}
            placeholder={`Item ${index + 1}`}
            onChange={(val) => updateItem(index, val)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addItem(index);
              }

              if (event.key === "Backspace" && !item) {
                event.preventDefault();
                removeItem(index);
              }
            }}
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            style={{
              color: "#D1D5DB",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 2,
              flexShrink: 0,
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addItem(items.length - 1)}
        style={{
          alignSelf: "flex-start",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          fontSize: "0.8rem",
          color: "#4F7B44",
          background: "none",
          border: "none",
          cursor: "pointer",
          marginTop: "0.25rem",
          fontWeight: 500,
        }}
      >
        <Plus size={13} /> Add item
      </button>
    </div>
  );
}

function CalloutBlock({ block, onChange }) {
  const ref = useRef(null);
  const variants = {
    info: { bg: "#EFF6FF", border: "#BFDBFE", icon: "\u{1F4A1}" },
    tip: { bg: "#F0FDF4", border: "#BBF7D0", icon: "\u2705" },
    warning: { bg: "#FFFBEB", border: "#FDE68A", icon: "\u26A0\uFE0F" },
  };
  const variant = variants[block.variant || "info"];

  useEffect(() => {
    autoGrow(ref.current);
  }, [block.text]);

  return (
    <div
      style={{
        background: variant.bg,
        border: `1px solid ${variant.border}`,
        borderRadius: "0.625rem",
        padding: "0.875rem 1rem",
      }}
    >
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <span>{variant.icon}</span>
        <select
          value={block.variant || "info"}
          onChange={(event) => onChange({ variant: event.target.value })}
          style={{
            fontSize: "0.75rem",
            border: "none",
            background: "transparent",
            color: "#6B7280",
            cursor: "pointer",
          }}
        >
          <option value="info">Info</option>
          <option value="tip">Tip</option>
          <option value="warning">Warning</option>
        </select>
      </div>
      <FormatBar />
      <EditableText
        style={{ ...TA, fontSize: "0.9rem", color: "#111827", minHeight: 24, background: "transparent", border: "none" }}
        value={block.text || ""}
        placeholder="Callout text..."
        onChange={(val) => onChange({ text: val })}
        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); document.execCommand("insertLineBreak"); } }}
      />
    </div>
  );
}

function DividerBlock() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0" }}>
      <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
      <Minus size={14} style={{ color: "#D1D5DB" }} />
      <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
    </div>
  );
}

function AddBlockMenu({ onAdd, label = "Add block" }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handleMouseDown(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  useEffect(() => {
    if (!open || !menuRef.current) return;

    const rect = menuRef.current.getBoundingClientRect();
    const overflowY = rect.bottom - (window.innerHeight - 16);
    const overflowX = rect.right - (window.innerWidth - 16);

    if (overflowY > 0 || overflowX > 0) {
      menuRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [open]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          padding: "4px 12px",
          borderRadius: "9999px",
          border: "1px dashed #D1D5DB",
          background: "white",
          color: "#9CA3AF",
          fontSize: "0.75rem",
          cursor: "pointer",
          transition: "border-color 150ms, color 150ms",
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.borderColor = "#4F7B44";
          event.currentTarget.style.color = "#4F7B44";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.borderColor = "#D1D5DB";
          event.currentTarget.style.color = "#9CA3AF";
        }}
      >
        <Plus size={12} /> {label}
      </button>

      {open && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            background: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "0.75rem",
            boxShadow: "0 16px 40px rgba(0,0,0,0.14)",
            zIndex: 9999,
            padding: "0.375rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2px",
            minWidth: 248,
            maxHeight: "min(360px, 60vh)",
            overflowY: "auto",
          }}
        >
          {BLOCK_META.map((item) => (
            <button
              key={item.type}
              type="button"
              onClick={() => {
                onAdd(item.type);
                setOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.45rem 0.75rem",
                border: "none",
                borderRadius: "0.5rem",
                background: "transparent",
                cursor: "pointer",
                fontSize: "0.8125rem",
                color: "#111827",
                textAlign: "left",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = "#F0FDF4";
                event.currentTarget.style.color = "#4F7B44";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = "transparent";
                event.currentTarget.style.color = "#111827";
              }}
            >
              <item.icon size={14} /> {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ConclusionBlock({ block, onChange }) {
  return (
    <div style={{ background: "#4F7B44", borderRadius: "0.75rem", padding: "1.25rem 1.5rem" }}>
      <FormatBar />
      <EditableText
        style={{ ...TA, fontSize: "1rem", color: "white", minHeight: 28, background: "transparent", border: "none" }}
        value={block.text || ""}
        placeholder="Write your conclusion..."
        onChange={(val) => onChange({ text: val })}
        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); document.execCommand("insertLineBreak"); } }}
      />
    </div>
  );
}

function Block({ block, index, total, onChange, onDelete, onMove }) {
  const [hovered, setHovered] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const typeButtonRef = useRef(null);
  const typeMenuRef = useRef(null);
  const meta = BLOCK_META.find((item) => item.type === block.type) || BLOCK_META[0];
  const controlsVisible = hovered || typeOpen;

  useEffect(() => {
    if (!typeOpen) return undefined;

    function handleMouseDown(event) {
      if (
        typeMenuRef.current &&
        !typeMenuRef.current.contains(event.target) &&
        typeButtonRef.current &&
        !typeButtonRef.current.contains(event.target)
      ) {
        setTypeOpen(false);
      }
    }

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [typeOpen]);

  useEffect(() => {
    if (!typeOpen || !typeMenuRef.current) return;

    const rect = typeMenuRef.current.getBoundingClientRect();
    if (rect.bottom > window.innerHeight - 16 || rect.right > window.innerWidth - 16) {
      typeMenuRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [typeOpen]);

  function renderContent() {
    switch (block.type) {
      case "paragraph":
        return <ParagraphBlock block={block} onChange={onChange} />;
      case "heading":
        return <HeadingBlock block={block} onChange={onChange} level={2} />;
      case "subheading":
        return <HeadingBlock block={block} onChange={onChange} level={3} />;
      case "image":
        return <ImageBlock block={block} onChange={onChange} />;
      case "quote":
        return <QuoteBlock block={block} onChange={onChange} />;
      case "bullets":
        return <ListBlock block={block} onChange={onChange} numbered={false} />;
      case "numbered":
        return <ListBlock block={block} onChange={onChange} numbered />;
      case "callout":
        return <CalloutBlock block={block} onChange={onChange} />;
      case "divider":
        return <DividerBlock />;
      case "conclusion":
        return <ConclusionBlock block={block} onChange={onChange} />;
      default:
        return <ParagraphBlock block={block} onChange={onChange} />;
    }
  }

  return (
    <div
      style={{ position: "relative", marginBottom: "0.35rem", paddingLeft: 116 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          position: "absolute",
          left: 8,
          top: 8,
          width: 100,
          display: "flex",
          alignItems: "center",
          gap: "4px",
          opacity: controlsVisible ? 1 : 0,
          pointerEvents: controlsVisible ? "auto" : "none",
          transition: "opacity 150ms ease",
          zIndex: 100,
        }}
      >
        <div style={{ position: "relative" }}>
          <button
            ref={typeButtonRef}
            type="button"
            title="Change block type"
            onClick={() => setTypeOpen((value) => !value)}
            style={{
              padding: "3px 5px",
              borderRadius: 5,
              border: "1px solid #E5E7EB",
              background: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "#6B7280",
            }}
          >
            <meta.icon size={11} />
          </button>
          {typeOpen && (
            <div
              ref={typeMenuRef}
              style={{
                position: "absolute",
                left: 0,
                top: "calc(100% + 4px)",
                background: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "0.5rem",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                zIndex: 9999,
                minWidth: 160,
                padding: "0.25rem",
                maxHeight: "min(320px, 60vh)",
                overflowY: "auto",
              }}
            >
              {BLOCK_META.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    onChange({ type: item.type });
                    setTypeOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    width: "100%",
                    padding: "0.4rem 0.625rem",
                    background: block.type === item.type ? "#F0FDF4" : "transparent",
                    border: "none",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    fontSize: "0.8125rem",
                    color: block.type === item.type ? "#4F7B44" : "#111827",
                    fontWeight: block.type === item.type ? 600 : 400,
                    textAlign: "left",
                  }}
                >
                  <item.icon size={13} /> {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onMove("up")}
          disabled={index === 0}
          style={{
            padding: 3,
            border: "1px solid #E5E7EB",
            borderRadius: 4,
            background: "white",
            cursor: index === 0 ? "not-allowed" : "pointer",
            color: "#9CA3AF",
            opacity: index === 0 ? 0.4 : 1,
          }}
        >
          <ChevronUp size={11} />
        </button>

        <button
          type="button"
          onClick={() => onMove("down")}
          disabled={index === total - 1}
          style={{
            padding: 3,
            border: "1px solid #E5E7EB",
            borderRadius: 4,
            background: "white",
            cursor: index === total - 1 ? "not-allowed" : "pointer",
            color: "#9CA3AF",
            opacity: index === total - 1 ? 0.4 : 1,
          }}
        >
          <ChevronDown size={11} />
        </button>

        <button
          type="button"
          onClick={onDelete}
          style={{
            padding: 3,
            border: "1px solid #FECACA",
            borderRadius: 4,
            background: "white",
            cursor: "pointer",
            color: "#EF4444",
          }}
        >
          <Trash2 size={11} />
        </button>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: controlsVisible ? 10 : 1,
          padding: "0.625rem 0.75rem",
          borderRadius: "0.5rem",
          border: "1px solid",
          borderColor: controlsVisible ? "#D1FAE5" : "transparent",
          background: controlsVisible ? "#FAFFFE" : "transparent",
          transition: "border-color 150ms ease, background 150ms ease",
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
}

export default function RichEditor({ blocks, onChange }) {
  const safeBlocks = Array.isArray(blocks) && blocks.length > 0 ? blocks : [makeBlock("paragraph")];

  const update = useCallback(
    (id, patch) => {
      onChange(safeBlocks.map((block) => (block.id === id ? { ...block, ...patch } : block)));
    },
    [safeBlocks, onChange],
  );

  const remove = useCallback(
    (id) => {
      const nextBlocks = safeBlocks.filter((block) => block.id !== id);
      onChange(nextBlocks.length > 0 ? nextBlocks : [makeBlock("paragraph")]);
    },
    [safeBlocks, onChange],
  );

  const move = useCallback(
    (id, direction) => {
      const index = safeBlocks.findIndex((block) => block.id === id);
      if (direction === "up" && index === 0) return;
      if (direction === "down" && index === safeBlocks.length - 1) return;

      const nextBlocks = [...safeBlocks];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      [nextBlocks[index], nextBlocks[swapIndex]] = [nextBlocks[swapIndex], nextBlocks[index]];
      onChange(nextBlocks);
    },
    [safeBlocks, onChange],
  );

  const addBlock = useCallback(
    (type = "paragraph") => {
      onChange([...safeBlocks, makeBlock(type)]);
    },
    [safeBlocks, onChange],
  );

  return (
    <div style={{ position: "relative" }}>
      {safeBlocks.map((block, index) => (
        <Block
          key={block.id}
          block={block}
          index={index}
          total={safeBlocks.length}
          onChange={(patch) => update(block.id, patch)}
          onDelete={() => remove(block.id)}
          onMove={(direction) => move(block.id, direction)}
        />
      ))}
      <div style={{ marginTop: "0.75rem", marginLeft: 116 }}>
        <AddBlockMenu onAdd={addBlock} />
      </div>
    </div>
  );
}

export function blocksToHtml(blocks) {
  if (!Array.isArray(blocks)) return typeof blocks === "string" ? blocks : "";

  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return `<p style="font-size:1rem;color:#111827;line-height:1.8;margin:0 0 1rem">${block.text || ""}</p>`;
        case "heading":
          return `<h2 style="font-size:1.375rem;font-weight:700;color:#111827;margin:2rem 0 0.75rem;padding-left:0.75rem;border-left:3px solid #4F7B44">${block.text || ""}</h2>`;
        case "subheading":
          return `<h3 style="font-size:1.1rem;font-weight:600;color:#1F2937;margin:1.5rem 0 0.5rem">${block.text || ""}</h3>`;
        case "image":
          return block.url
            ? `<figure style="margin:1.5rem 0"><img loading="lazy" src="${resolveApiAssetUrl(block.url)}" alt="${block.alt || ""}" style="width:100%;border-radius:8px;display:block">${block.caption ? `<figcaption style="text-align:center;font-size:0.8125rem;color:#6B7280;margin-top:0.5rem">${block.caption}</figcaption>` : ""}</figure>`
            : "";
        case "quote":
          return `<blockquote style="border-left:4px solid #4F7B44;margin:1.5rem 0;padding:0.75rem 1.25rem;font-style:italic;color:#111827;background:#F9FAFB;border-radius:0 8px 8px 0">${block.text || ""}</blockquote>`;
        case "bullets":
          return `<ul style="margin:0.5rem 0 1rem;padding-left:1.25rem">${(block.items || []).map((item) => `<li style="margin-bottom:0.375rem;color:#111827">${item}</li>`).join("")}</ul>`;
        case "numbered":
          return `<ol style="margin:0.5rem 0 1rem;padding-left:1.25rem">${(block.items || []).map((item) => `<li style="margin-bottom:0.375rem;color:#111827">${item}</li>`).join("")}</ol>`;
        case "callout":
          return `<div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:1rem 1.25rem;margin:1rem 0"><p style="margin:0;color:#111827">${block.text || ""}</p></div>`;
        case "divider":
          return `<hr style="border:none;border-top:1px solid #E5E7EB;margin:2rem 0">`;
        case "conclusion":
          return `<div style="background:#4F7B44;border-radius:8px;padding:1.25rem 1.5rem;margin:1.5rem 0"><p style="margin:0;font-size:1rem;color:white;line-height:1.8">${block.text || ""}</p></div>`;
        default:
          return "";
      }
    })
    .join("\n");
}

function normalizeParsedBlock(block) {
  const nextBlock = { ...(block || {}), id: uid() };

  if (nextBlock.type === "image") {
    nextBlock.url = resolveApiAssetUrl(nextBlock.url);
  }

  return nextBlock;
}

export function parseContentToBlocks(raw) {
  if (Array.isArray(raw) && raw.length > 0) {
    return raw.map(normalizeParsedBlock);
  }

  if (typeof raw === "string" && raw.trim()) {
    try {
      const parsed = JSON.parse(raw.trim());
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeParsedBlock);
      }
    } catch {}

    return raw
      .split(/\n{2,}/)
      .filter(Boolean)
      .map((text) => ({ id: uid(), type: "paragraph", text: text.trim() }));
  }

  return [makeBlock("paragraph")];
}
