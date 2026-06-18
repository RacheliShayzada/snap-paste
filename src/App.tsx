import { useState, useRef, useEffect } from "react";
import { SnippetList } from "./components/SnippetList/SnippetList";
import { SnippetModal } from "./components/SnippetModal/SnippetModal";
import { handleItemClick } from "./utils/paste";
import { useSnippets } from "./hooks/useSnippets";
import type { SnippetItem } from "./types/snippet";
import "./App.css";

const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

type ModalState =
  | null
  | { mode: "add" }
  | { mode: "edit"; item: SnippetItem };

function App() {
  const { snippets, addSnippet, editSnippet, deleteSnippet } = useSnippets();
  const [modal, setModal] = useState<ModalState>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
      ) : (
        <SnippetList
          items={filtered}
          onItemClick={handleItemClick}
          onEdit={(item) => setModal({ mode: "edit", item })}
          onDelete={deleteSnippet}
        />
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
