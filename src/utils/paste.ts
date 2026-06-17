import { invoke } from "@tauri-apps/api/core";

export async function handleItemClick(content: string): Promise<void> {
  try {
    await invoke("hide_and_paste", { content });
  } catch (err) {
    console.error("[handleItemClick] hide_and_paste failed:", err);
  }
}
