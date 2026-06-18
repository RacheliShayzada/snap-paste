import { useState, useEffect } from "react";
import "./SnippetModal.css";

interface Props {
  mode: "add" | "edit";
  initialTitle?: string;
  initialContent?: string;
  onSave: (title: string, content: string) => Promise<void>;
  onClose: () => void;
}

export function SnippetModal({
  mode,
  initialTitle = "",
  initialContent = "",
  onSave,
  onClose,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);

  // Sync initial values when the modal re-opens for a different item.
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent]);

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || saving) return;
    setSaving(true);
    await onSave(title.trim(), content.trim());
    setSaving(false);
    onClose();
  };

  const heading = mode === "add" ? "New Snippet" : "Edit Snippet";
  const submitLabel = saving ? "Saving…" : mode === "add" ? "Add" : "Save";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{heading}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-field">
            <label className="modal-label">Title</label>
            <input
              className="modal-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Greeting"
              autoFocus
            />
          </div>
          <div className="modal-field">
            <label className="modal-label">Content</label>
            <textarea
              className="modal-input modal-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Text to paste…"
              rows={3}
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn-save"
              disabled={!isValid || saving}
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
