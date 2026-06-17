import { invoke } from "@tauri-apps/api/core";
import "./App.css";

interface SnippetItem {
  id: number;
  title: string;
  content: string;
}

const SNIPPETS: SnippetItem[] = [
  { id: 1, title: "Greeting",       content: "Hello! How can I help you today?" },
  { id: 2, title: "Sign-off",       content: "Best regards,\nYour Name" },
  { id: 3, title: "Meeting Link",   content: "https://meet.example.com/my-room" },
  { id: 4, title: "Phone Number",   content: "+1 (555) 123-4567" },
  { id: 5, title: "Email Address",  content: "hello@example.com" },
  { id: 6, title: "Mailing Address",content: "123 Main St, Springfield, USA 12345" },
  { id: 7, title: "Out of Office",  content: "I'm currently out of office and will return on Monday." },
  { id: 8, title: "Thank You",      content: "Thank you for reaching out. I'll get back to you shortly." },
];

async function handleItemClick(content: string) {
  // Pass content directly to Rust — clipboard is written there, which is
  // more reliable than the browser Clipboard API inside WebView2 on Windows.
  try {
    await invoke("hide_and_paste", { content });
  } catch (err) {
    console.error("[handleItemClick] hide_and_paste failed:", err);
  }
}

function App() {
  return (
    <main className="container">
      <h1 className="app-title">Snap Paste</h1>
      <ul className="snippet-list">
        {SNIPPETS.map((item) => (
          <li
            key={item.id}
            className="snippet-item"
            onClick={() => handleItemClick(item.content)}
          >
            <span className="snippet-title">{item.title}</span>
            <span className="snippet-preview">{item.content}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
