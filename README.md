<div align="center">

# ⚡ snap-paste

**A blazing-fast clipboard snippet launcher for Windows — built for developers who paste the same things every single day.**

[![Tauri](https://img.shields.io/badge/Tauri-v2-24C8DB?style=for-the-badge&logo=tauri&logoColor=white)](https://tauri.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Rust](https://img.shields.io/badge/Rust-CE422B?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

![Platform](https://img.shields.io/badge/Platform-Windows-0078D4?style=flat-square&logo=windows&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-a78bfa?style=flat-square)

</div>

---

## 🧠 The Story Behind It

Windows has a built-in clipboard history (`Win+V`) — but it's a mess.  
It fills up with **temporary copies**, has zero organization, and zero automation.

As a Software Engineer, I found myself constantly retyping the same commands, links, greetings, and code snippets dozens of times a day. I wanted something better:

> A **dedicated, permanent, lightning-fast vault** for the snippets I actually use — that pastes directly at my cursor in a single snap.

So I built **snap-paste**: a minimal, always-available desktop launcher that lives in the background, appears on a global hotkey, and disappears the moment you click a snippet — automatically pasting it wherever your cursor was.

---

## ✨ Features

| Feature | Description |
|---|---|
| ⚡ **Auto-Paste** | Click a snippet → window hides → text is pasted at your cursor. No Ctrl+V needed. |
| ✏️ **Full CRUD** | Add, edit, and delete your snippets with a clean modal UI. |
| 🔍 **Smart Search** | Real-time filtering by title or content with a toggleable search bar. |
| ⌨️ **Global Hotkey** | Summon snap-paste from **anywhere** with a configurable system-wide shortcut. |
| 🎨 **Theme Accents** | Choose from 4 accent colors: Lavender, Teal, Coral, and Slate. |
| 🚀 **Launch on Startup** | Optionally start with Windows so it's always ready. |
| 🔒 **Background Running** | Pressing X hides the window — the process stays alive, ready for your next hotkey. |
| 💾 **Persistent Storage** | All snippets and settings survive app restarts via native app-data storage. |

---

## 🛠️ Tech Stack

**snap-paste** is a native Windows desktop app powered by **Tauri v2** — combining a Rust backend with a React frontend, compiled into a single lightweight executable.

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + TypeScript | UI, state management, snippet interactions |
| **Styling** | Tailwind CSS + CSS Variables | Dark theme with dynamic accent color theming |
| **Backend** | Rust (Tauri v2) | Window management, global shortcuts, native paste |
| **Clipboard** | `arboard` (Rust) | Reliable cross-process clipboard writes on Windows |
| **Paste Simulation** | `windows-sys` Win32 `SendInput` | Simulates `Ctrl+V` using native VK codes — the only method apps reliably recognize |
| **Persistence** | `tauri-plugin-store` | JSON-based storage in `AppData` for snippets and settings |
| **Global Shortcuts** | `tauri-plugin-global-shortcut` | System-wide hotkey registration managed from Rust |
| **Autostart** | `tauri-plugin-autostart` | Windows Registry launch-on-startup integration |

> **Why Win32 `SendInput` instead of a library?**  
> Most clipboard libraries (including `enigo`) use `KEYEVENTF_UNICODE` to send characters — which apps treat as raw text input, **not** a paste command. `SendInput` with `VK_CONTROL + VK_V` is the only approach that triggers the actual paste shortcut in every app.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 18
- [Rust](https://rustup.rs) (stable toolchain)
- [Tauri v2 prerequisites](https://tauri.app/start/prerequisites/) for Windows

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/snap-paste.git
cd snap-paste

# Install JS dependencies
npm install
```

### Development

```bash
npm run tauri dev
```

This starts the Vite dev server and the Tauri process with hot-reload. A native window will open.

### Production Build

```bash
npm run tauri build
```

Outputs a standalone `.exe` installer to `src-tauri/target/release/bundle/`.

---

## 🎮 How to Use

1. **Launch** snap-paste — it starts minimized or visible depending on your settings.
2. **Press your global hotkey** (default: `Ctrl+Shift+Space`) from any app.
3. The snap-paste window **instantly appears**.
4. **Click any snippet** — the window hides and the text is **automatically pasted** at your cursor.
5. Press **`X`** to hide back to background — or configure **Launch on Startup** in Settings so it's always running.

### ⚙️ Settings

Open Settings from the gear icon (`⚙`) in the header:

- **Accent Color** — Switch the entire UI accent between Lavender, Teal, Coral, or Slate.
- **Global Hotkey** — Pick from 5 predefined system-wide shortcuts.
- **Launch on Startup** — Toggle automatic start with Windows.

---

## 🏗️ Architecture Notes

### Why the HWND is captured in Rust, not JS

When a global shortcut fires, snap-paste needs to remember **which window was active** so it can restore focus and paste into it. This HWND must be captured at the **exact moment the key is pressed**.

If captured after a JS↔Rust IPC round-trip, Windows has already activated the WebView2 process and `GetForegroundWindow()` returns snap-paste's own window — causing paste to fail. The handler runs entirely in Rust so the HWND is saved with zero delay.

---

## 📁 Project Structure

```
snap-paste/
├── src/                        # React frontend
│   ├── components/
│   │   ├── SnippetItem/        # Row with kebab edit/delete menu
│   │   ├── SnippetList/        # Scrollable snippet list
│   │   ├── SnippetModal/       # Add/edit modal
│   │   └── SettingsView/       # Settings panel (theme, hotkey, startup)
│   ├── hooks/
│   │   ├── useSnippets.ts      # CRUD + store persistence
│   │   └── useSettings.ts      # Theme, hotkey, autostart management
│   ├── types/
│   │   ├── snippet.ts
│   │   └── settings.ts         # Theme defs, hotkey options, defaults
│   └── utils/
│       └── paste.ts            # Calls hide_and_paste Tauri command
└── src-tauri/                  # Rust backend
    └── src/
        └── lib.rs              # Commands: hide_and_paste, set_hotkey, show_window
```

---

<div align="center">

---

Built with 💜 by **Racheli Shayzada**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Racheli_Shayzada-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/racheli-shayzada-1b7b72369/)

*Software Engineer — turning daily friction into elegant tools.*

</div>
