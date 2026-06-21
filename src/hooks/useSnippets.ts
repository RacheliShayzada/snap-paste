import { useState, useEffect } from "react";
import { Store } from "@tauri-apps/plugin-store";
import { SNIPPETS } from "../data/snippets";
import type { SnippetItem } from "../types/snippet";

const STORE_FILE = "snippets.json";
const STORE_KEY = "snippets";

export function useSnippets() {
  const [snippets, setSnippets] = useState<SnippetItem[]>(SNIPPETS);
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    let mounted = true;

    Store.load(STORE_FILE).then(async (s) => {
      if (!mounted) return;
      setStore(s);

      const saved = await s.get<SnippetItem[]>(STORE_KEY);
      if (saved && Array.isArray(saved) && saved.length > 0) {
        setSnippets(saved);
      } else {
        // First run — persist the default snippets so they're editable later.
        await s.set(STORE_KEY, SNIPPETS);
        await s.save();
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const addSnippet = async (title: string, content: string): Promise<void> => {
    const newItem: SnippetItem = { id: Date.now(), title, content };
    const updated = [...snippets, newItem];
    setSnippets(updated);
    if (store) {
      await store.set(STORE_KEY, updated);
      await store.save();
    }
  };

  const editSnippet = async (
    id: number,
    title: string,
    content: string
  ): Promise<void> => {
    const updated = snippets.map((s) =>
      s.id === id ? { ...s, title, content } : s
    );
    setSnippets(updated);
    if (store) {
      await store.set(STORE_KEY, updated);
      await store.save();
    }
  };

  const deleteSnippet = async (id: number): Promise<void> => {
    const updated = snippets.filter((s) => s.id !== id);
    setSnippets(updated);
    if (store) {
      await store.set(STORE_KEY, updated);
      await store.save();
    }
  };

  const reorderSnippets = async (sourceIndex: number, destIndex: number): Promise<void> => {
    const updated = [...snippets];
    const [moved] = updated.splice(sourceIndex, 1);
    updated.splice(destIndex, 0, moved);
    setSnippets(updated);
    if (store) {
      await store.set(STORE_KEY, updated);
      await store.save();
    }
  };

  return { snippets, addSnippet, editSnippet, deleteSnippet, reorderSnippets };
}
