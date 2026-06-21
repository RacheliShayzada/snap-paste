# Changelog

All notable changes to **snap-paste** are documented here.
This project follows [Semantic Versioning](https://semver.org/).

---

## [0.2.0] - 2026-06-21

### ✨ Added

- **Drag & Drop Reordering** — snippets can now be reordered by dragging via a dedicated grip handle on the left side of each row. Smooth visual feedback during drag: the item lifts with an elevated shadow and an accent-coloured left border. Drag is automatically disabled while search is active (indices remain safe). Order is persisted to `snippets.json` immediately after each drop.
- **Light Mode** — a Color Mode toggle in Settings lets users switch between Dark (default) and Light themes. The full UI — including all components and modals — is styled with CSS custom properties and updates instantly without a reload. Selection is persisted across restarts.
- **Update Checker** — on launch, the app silently queries the GitHub Releases API and displays a subtle animated chip below the header if a newer version is available. Clicking it opens the releases page in the system browser via `tauri-plugin-opener`.
- **Empty State** — when no snippets exist, a friendly placeholder message prompts the user to press **+** to add their first snippet.

### 🐛 Fixed

- **First-item dropdown clipped** — the 3-dots action popover on the first list item was being cut off by the scrollable container's `overflow: hidden`. Fixed by inverting the dropdown anchor direction for `:first-child` (opens downward instead of upward).
- **Fresh-install data** — the default snippet set is now a single clean `Example` placeholder instead of leftover development entries.

### 🔧 Changed

- `SnippetList` wraps content in `DragDropContext` + `Droppable` from `@hello-pangea/dnd`.
- `SnippetItem` accepts `innerRef`, `draggableProps`, `dragHandleProps`, and `isDragging` props for D&D integration.
- `useSnippets` exposes a new `reorderSnippets(sourceIndex, destIndex)` helper.
- All component-level CSS files migrated from hardcoded hex colours to CSS custom properties (`--bg-*`, `--text-*`, `--border-*`) enabling theme switching without duplication.
- `useSettings` exports `applyMode()` and an updated `applyTheme()` that adapts hover/active colours per mode.
- Version bumped to `0.2.0` in `package.json` and `tauri.conf.json`.

---

## [0.1.0] - 2026-06-17

### 🎉 Initial MVP Release

- **CRUD snippets** — create, read, edit, and delete named text snippets via a modal UI.
- **Auto-Paste on click** — clicking a snippet hides the window and simulates `Ctrl+V` at the previous cursor position using Win32 `SendInput` (reliable across all apps).
- **Global hotkey** — configurable system-wide shortcut (default `Ctrl+Shift+Space`) summons the window from anywhere; implemented in Rust for zero-latency HWND capture.
- **Accent color themes** — choose from Lavender, Teal, Coral, or Slate; applied via CSS custom properties at runtime.
- **Launch on startup** — optional Windows Registry autostart via `tauri-plugin-autostart`.
- **Background running** — the `X` button hides the window instead of terminating the process; app stays alive for the next hotkey press.
- **Persistent storage** — snippets and settings survive restarts via `tauri-plugin-store` (`AppData` JSON).
- **Real-time search** — toggleable search bar filters snippets by title and content.
- **Settings view** — dedicated panel for hotkey, theme, and startup configuration.


---

## [0.2.0] � 2026-06-21

### ? Added

- **Drag & Drop reordering** � snippets can now be reordered by dragging via a dedicated grip handle on the left side of each row.
- Smooth visual feedback during drag: the dragged item lifts with an elevated shadow and accent-coloured left border.
- Grip handle icon (?) appears on hover and changes cursor to `grab` / `grabbing`.
- Drag is automatically disabled while the search bar is active (indices are safe).
- Reordered order is persisted to `snippets.json` in AppData immediately after each drop.

### ?? Changed

- `SnippetList` now wraps its content in `DragDropContext` + `Droppable` from `@hello-pangea/dnd`.
- `SnippetItem` accepts optional drag-handle and draggable props for D&D integration.
- `useSnippets` exposes a new `reorderSnippets(sourceIndex, destIndex)` helper.

---

## [0.1.0] � 2026-06-17

### ?? Initial MVP Release

- **CRUD snippets** � create, read, edit, and delete named text snippets via a modal UI.
- **Auto-Paste on click** � clicking a snippet hides the window and simulates `Ctrl+V` at the previous cursor position using Win32 `SendInput` (reliable across all apps).
- **Global hotkey** � configurable system-wide shortcut (default `Ctrl+Shift+Space`) summons the window from anywhere; implemented in Rust for zero-latency HWND capture.
- **Accent color themes** � choose from Lavender, Teal, Coral, or Slate; applied via CSS custom properties at runtime.
- **Launch on startup** � optional Windows Registry autostart via `tauri-plugin-autostart`.
- **Background running** � the `X` button hides the window instead of terminating the process; app stays alive for the next hotkey press.
- **Persistent storage** � snippets and settings survive restarts via `tauri-plugin-store` (`AppData` JSON).
- **Real-time search** � toggleable search bar filters snippets by title and content.
- **Settings view** � dedicated panel for hotkey, theme, and startup configuration.
