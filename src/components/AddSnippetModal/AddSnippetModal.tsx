import { useState } from "react";
import "./AddSnippetModal.css";

interface Props {
  onAdd: (title: string, content: string) => Promise<void>;
  onClose: () => void;
}

export function AddSnippetModal({ onAdd, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || saving) return;
    setSaving(true);
    await onAdd(title.trim(), content.trim());
    setSaving(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">New Snippet</h2>
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
              className="modal-btn modal-btn-add"
              disabled={!isValid || saving}
            >
              {saving ? "Saving…" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
