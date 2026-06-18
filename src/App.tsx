import { useState } from "react";
import { SnippetList } from "./components/SnippetList/SnippetList";
import { AddSnippetModal } from "./components/AddSnippetModal/AddSnippetModal";
import { handleItemClick } from "./utils/paste";
import { useSnippets } from "./hooks/useSnippets";
import "./App.css";

function App() {
  const { snippets, addSnippet } = useSnippets();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="container">
      <header className="app-header">
        <button
          className="add-btn"
          onClick={() => setModalOpen(true)}
          title="Add snippet"
        >
          +
        </button>
        <h1 className="app-title">Snap Paste</h1>
      </header>

      <SnippetList items={snippets} onItemClick={handleItemClick} />

      {modalOpen && (
        <AddSnippetModal
          onAdd={addSnippet}
          onClose={() => setModalOpen(false)}
        />
      )}
    </main>
  );
}

export default App;
