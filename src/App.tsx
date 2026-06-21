import { useState, useRef, useEffect } from "react";
import { SnippetList } from "./components/SnippetList/SnippetList";
import { SnippetModal } from "./components/SnippetModal/SnippetModal";
import { SettingsView } from "./components/SettingsView/SettingsView";
import { handleItemClick } from "./utils/paste";
import { useSnippets } from "./hooks/useSnippets";
import { useSettings } from "./hooks/useSettings";
import type { SnippetItem } from "./types/snippet";
import "./App.css";

const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

type ModalState =
  | null
  | { mode: "add" }
  | { mode: "edit"; item: SnippetItem };

function App() {
  const { snippets, addSnippet, editSnippet, deleteSnippet, reorderSnippets } = useSnippets();
  const { settings, setAccentColor, setHotkey, setLaunchOnStartup, setColorMode } = useSettings();
  const [modal, setModal] = useState<ModalState>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input whenever the search bar opens.
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const toggleSearch = () => {
    if (searchOpen) {
      setSearchQuery("");
      setSearchOpen(false);
    } else {
      setSearchOpen(true);
    }
  };

  const filtered = searchQuery.trim()
    ? snippets.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : snippets;

  const handleSave = async (title: string, content: string) => {
    if (modal?.mode === "add") {
      await addSnippet(title, content);
    } else if (modal?.mode === "edit") {
      await editSnippet(modal.item.id, title, content);
    }
  };

  return (
    <main className="container">
      {settingsOpen ? (
        <SettingsView
          settings={settings}
          onColorChange={setAccentColor}
          onHotkeyChange={setHotkey}
          onStartupChange={setLaunchOnStartup}
          onModeChange={setColorMode}
          onBack={() => setSettingsOpen(false)}
        />
      ) : (
        <>
          <header className="app-header">
            <button className="icon-btn" onClick={() => setModal({ mode: "add" })} title="Add snippet">
              +
            </button>
            <h1 className="app-title">Snap Paste</h1>
            <button
              className={`icon-btn ${searchOpen ? "icon-btn--active" : ""}`}
              onClick={toggleSearch}
              title="Search"
            >
              <SearchIcon />
            </button>
            <button
              className={`icon-btn ${settingsOpen ? "icon-btn--active" : ""}`}
              onClick={() => { setSearchOpen(false); setSearchQuery(""); setSettingsOpen(true); }}
              title="Settings"
            >
              <SettingsIcon />
            </button>
          </header>

          {searchOpen && (
            <div className="search-row">
              <span className="search-row-icon"><SearchIcon /></span>
              <input
                ref={searchRef}
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search snippets…"
                onKeyDown={(e) => e.key === "Escape" && toggleSearch()}
              />
            </div>
          )}

          {filtered.length === 0 && searchQuery.trim() ? (
            <p className="search-empty">No snippets match "{searchQuery}"</p>
          ) : filtered.length === 0 ? (
            <p className="search-empty">No snippets yet - press <strong>+</strong> to add one.</p>
          ) : (
            <SnippetList
              items={filtered}
              onItemClick={handleItemClick}
              onEdit={(item) => setModal({ mode: "edit", item })}
              onDelete={deleteSnippet}
              onReorder={searchQuery.trim() ? undefined : reorderSnippets}
            />
          )}
        </>
      )}

      {modal && (
        <SnippetModal
          mode={modal.mode}
          initialTitle={modal.mode === "edit" ? modal.item.title : ""}
          initialContent={modal.mode === "edit" ? modal.item.content : ""}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </main>
  );
}

export default App;
