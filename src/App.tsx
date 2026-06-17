import { SNIPPETS } from "./data/snippets";
import { SnippetList } from "./components/SnippetList/SnippetList";
import { handleItemClick } from "./utils/paste";
import "./App.css";

function App() {
  return (
    <main className="container">
      <h1 className="app-title">Snap Paste</h1>
      <SnippetList items={SNIPPETS} onItemClick={handleItemClick} />
    </main>
  );
}

export default App;
