import { useRef, useState } from "react";
import { AlertCircle, Paperclip, Send, X } from "lucide-react";
import toast from "react-hot-toast";

import RichEditor, { blocksToHtml } from "@/components/cms/RichEditor";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import api from "@/lib/api";

export default function BroadcastPage() {
  const [subject, setSubject] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [files, setFiles] = useState([]);
  const [sending, setSending] = useState(false);
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (files.length + selectedFiles.length > 5) {
      toast.error("You can only attach up to 5 files.");
      return;
    }

    const totalSize = [...files, ...selectedFiles].reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 10 * 1024 * 1024) {
      toast.error("Total attachment size cannot exceed 10MB.");
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const validateBroadcast = () => {
    if (!subject.trim()) {
      toast.error("Please enter a subject.");
      return false;
    }

    const htmlContent = blocksToHtml(blocks);
    if (!htmlContent || htmlContent.trim() === "") {
      toast.error("Please enter some content for the email.");
      return false;
    }

    return true;
  };

  const handleSendClick = () => {
    if (!validateBroadcast()) {
      return;
    }

    setShowSendConfirm(true);
  };

  const confirmSend = async () => {
    const htmlContent = blocksToHtml(blocks);

    setSending(true);
    try {
      const formData = new FormData();
      formData.append("subject", subject.trim());
      formData.append("content", htmlContent);
      files.forEach((file) => formData.append("attachments", file));

      const response = await api.post("/newsletter/broadcast", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data.message || "Broadcast sent successfully!");
      setSubject("");
      setBlocks([]);
      setFiles([]);
      setShowSendConfirm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send broadcast.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <ConfirmDialog
        open={showSendConfirm}
        title="Send this broadcast now?"
        description="This will immediately email all active newsletter subscribers with the current subject, content, and attachments."
        confirmLabel="Send broadcast"
        cancelLabel="Review message"
        tone="neutral"
        busy={sending}
        onCancel={() => {
          if (!sending) setShowSendConfirm(false);
        }}
        onConfirm={confirmSend}
      />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#111827", marginBottom: "0.5rem" }}>
            Email Broadcast
          </h1>
          <p style={{ color: "#6B7280" }}>
            Compose and send an email to all active newsletter subscribers.
          </p>
        </div>

        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E5E7EB", overflow: "hidden" }}>
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #E5E7EB" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "0.5rem" }}>
              Email Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="E.g., Monthly Update from RUGAN"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #D1D5DB",
                fontSize: "1rem",
                outline: "none",
              }}
              onFocus={(event) => (event.target.style.borderColor = "#4F7B44")}
              onBlur={(event) => (event.target.style.borderColor = "#D1D5DB")}
            />
          </div>

          <div style={{ padding: "1.5rem", borderBottom: "1px solid #E5E7EB", minHeight: 400 }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#374151", marginBottom: "1rem" }}>
              Email Body
            </label>
            <RichEditor blocks={blocks} onChange={setBlocks} />
          </div>

          <div style={{ padding: "1.5rem", background: "#F9FAFB" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Paperclip size={16} /> Attachments
              </label>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  fontSize: "0.875rem",
                  color: "#4F7B44",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                + Add File
              </button>
            </div>

            {files.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {files.map((file, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", border: "1px solid #E5E7EB", borderRadius: "6px", padding: "0.5rem 0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", overflow: "hidden" }}>
                      <Paperclip size={14} color="#6B7280" />
                      <span style={{ fontSize: "0.875rem", color: "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {file.name}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", display: "flex", alignItems: "center", padding: "0.25rem" }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {files.length === 0 && (
              <p style={{ fontSize: "0.875rem", color: "#9CA3AF", fontStyle: "italic", margin: 0 }}>
                No files attached. Max 5 files, 10MB total.
              </p>
            )}
          </div>

          <div style={{ padding: "1.5rem", borderTop: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "space-between", background: "white" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#F59E0B", fontSize: "0.875rem" }}>
              <AlertCircle size={16} />
              <span>This will immediately email all verified subscribers.</span>
            </div>
            <button
              onClick={handleSendClick}
              disabled={sending}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: sending ? "#9CA3AF" : "#4F7B44",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                fontWeight: 600,
                border: "none",
                cursor: sending ? "not-allowed" : "pointer",
                transition: "background 200ms",
              }}
            >
              {sending ? "Sending..." : "Send Broadcast"}
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
