import { useState } from "react";
import { SnippetList } from "./components/SnippetList/SnippetList";
import { SnippetModal } from "./components/SnippetModal/SnippetModal";
import { handleItemClick } from "./utils/paste";
import { useSnippets } from "./hooks/useSnippets";
import type { SnippetItem } from "./types/snippet";
import "./App.css";

type ModalState =
  | null
  | { mode: "add" }
  | { mode: "edit"; item: SnippetItem };

function App() {
  const { snippets, addSnippet, editSnippet, deleteSnippet } = useSnippets();
  const [modal, setModal] = useState<ModalState>(null);

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
        <button
          className="add-btn"
          onClick={() => setModal({ mode: "add" })}
          title="Add snippet"
        >
          +
        </button>
        <h1 className="app-title">Snap Paste</h1>
      </header>

      <SnippetList
        items={snippets}
        onItemClick={handleItemClick}
        onEdit={(item) => setModal({ mode: "edit", item })}
        onDelete={deleteSnippet}
      />

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
