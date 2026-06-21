# Changelog

All notable changes to **snap-paste** are documented here.
This project follows [Semantic Versioning](https://semver.org/).

---

## [0.2.0] — 2026-06-21

### ? Added

- **Drag & Drop reordering** — snippets can now be reordered by dragging via a dedicated grip handle on the left side of each row.
- Smooth visual feedback during drag: the dragged item lifts with an elevated shadow and accent-coloured left border.
- Grip handle icon (?) appears on hover and changes cursor to `grab` / `grabbing`.
- Drag is automatically disabled while the search bar is active (indices are safe).
- Reordered order is persisted to `snippets.json` in AppData immediately after each drop.

### ?? Changed

- `SnippetList` now wraps its content in `DragDropContext` + `Droppable` from `@hello-pangea/dnd`.
- `SnippetItem` accepts optional drag-handle and draggable props for D&D integration.
- `useSnippets` exposes a new `reorderSnippets(sourceIndex, destIndex)` helper.

---

## [0.1.0] — 2026-06-17

### ?? Initial MVP Release

- **CRUD snippets** — create, read, edit, and delete named text snippets via a modal UI.
- **Auto-Paste on click** — clicking a snippet hides the window and simulates `Ctrl+V` at the previous cursor position using Win32 `SendInput` (reliable across all apps).
- **Global hotkey** — configurable system-wide shortcut (default `Ctrl+Shift+Space`) summons the window from anywhere; implemented in Rust for zero-latency HWND capture.
- **Accent color themes** — choose from Lavender, Teal, Coral, or Slate; applied via CSS custom properties at runtime.
- **Launch on startup** — optional Windows Registry autostart via `tauri-plugin-autostart`.
- **Background running** — the `X` button hides the window instead of terminating the process; app stays alive for the next hotkey press.
- **Persistent storage** — snippets and settings survive restarts via `tauri-plugin-store` (`AppData` JSON).
- **Real-time search** — toggleable search bar filters snippets by title and content.
- **Settings view** — dedicated panel for hotkey, theme, and startup configuration.
