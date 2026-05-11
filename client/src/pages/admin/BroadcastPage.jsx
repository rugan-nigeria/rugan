import { useRef, useState } from "react";
import { AlertCircle, Paperclip, Plus, Send, X } from "lucide-react";
import toast from "react-hot-toast";

import RichEditor, { blocksToHtml } from "@/components/cms/RichEditor";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import api from "@/lib/api";

export default function BroadcastPage() {
  const isCompactMobile = useMediaQuery("(max-width: 639px)");
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

    const totalSize = [...files, ...selectedFiles].reduce((accumulator, file) => accumulator + file.size, 0);
    if (totalSize > 10 * 1024 * 1024) {
      toast.error("Total attachment size cannot exceed 10MB.");
      return;
    }

    setFiles((current) => [...current, ...selectedFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index) => {
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
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
    if (!validateBroadcast()) return;
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

      toast.success(response.data.message || "Broadcast sent successfully.");
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

      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-[#111827] sm:text-3xl">Email Broadcast</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Compose and send an email to all active newsletter subscribers.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
          <div className="border-b border-[#E5E7EB] px-4 py-4 sm:px-6">
            <label className="mb-2 block text-sm font-semibold text-[#374151]">Email Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="E.g., Monthly Update from RUGAN"
              className="form-input"
              style={{ fontSize: "1rem" }}
            />
          </div>

          <div className="min-h-[320px] border-b border-[#E5E7EB] px-4 py-4 sm:px-6 sm:py-6">
            <label className="mb-4 block text-sm font-semibold text-[#374151]">Email Body</label>
            <RichEditor blocks={blocks} onChange={setBlocks} />
          </div>

          <div className="bg-[#F9FAFB] px-4 py-4 sm:px-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-[#374151]">
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
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Add attachment"
                title="Add attachment"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#D0D5DD] bg-white px-3 py-2 text-sm font-semibold text-[#4F7B44]"
              >
                <Plus size={14} />
                {!isCompactMobile && "Add file"}
              </button>
            </div>

            {files.length > 0 ? (
              <div className="flex flex-col gap-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-3 rounded-lg border border-[#E5E7EB] bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-2">
                      <Paperclip size={14} color="#6B7280" className="mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="truncate text-sm text-[#374151]">{file.name}</p>
                        <p className="text-xs text-[#9CA3AF]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      aria-label={`Remove ${file.name}`}
                      title="Remove attachment"
                      className="inline-flex min-h-10 items-center justify-center gap-1 self-start rounded-lg border border-[#FECACA] px-3 py-2 text-sm font-medium text-[#EF4444] sm:self-center"
                    >
                      <X size={14} />
                      {!isCompactMobile && "Remove"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="m-0 text-sm italic text-[#9CA3AF]">
                No files attached. Max 5 files, 10MB total.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 border-t border-[#E5E7EB] bg-white px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-2 text-sm text-[#B54708]">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>This will immediately email all verified subscribers.</span>
            </div>

            <button
              type="button"
              onClick={handleSendClick}
              disabled={sending}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#4F7B44] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3D6235] disabled:cursor-not-allowed disabled:bg-[#9CA3AF] sm:w-auto"
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
