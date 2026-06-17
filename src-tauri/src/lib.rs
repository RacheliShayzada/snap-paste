use enigo::{Direction, Enigo, Key, Keyboard, Settings};
use tauri::{AppHandle, Manager};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Hides the app window immediately, writes `content` to the clipboard from
/// the Rust side (reliable on Windows), waits for the OS to transfer focus
/// back to the previous window, then simulates Ctrl+V.
#[tauri::command]
async fn hide_and_paste(app: AppHandle, content: String) -> Result<(), String> {
    println!("[hide_and_paste] called with content: {:?}", content);

    // Hide the window first so focus leaves our app.
    if let Some(window) = app.get_webview_window("main") {
        window.hide().map_err(|e| e.to_string())?;
        println!("[hide_and_paste] window hidden");
    } else {
        println!("[hide_and_paste] ERROR: could not find window 'main'");
    }

    // Offload all blocking work (clipboard + sleep + keystroke) to a
    // dedicated thread. Enigo and arboard are not Send across await points.
    tauri::async_runtime::spawn_blocking(move || -> Result<(), String> {
        // Write to clipboard from Rust — more reliable than the browser API
        // inside WebView2 on Windows.
        let mut clipboard = arboard::Clipboard::new().map_err(|e| {
            let msg = format!("[hide_and_paste] arboard init error: {e}");
            println!("{msg}");
            msg
        })?;
        clipboard.set_text(&content).map_err(|e| {
            let msg = format!("[hide_and_paste] clipboard set_text error: {e}");
            println!("{msg}");
            msg
        })?;
        println!("[hide_and_paste] clipboard written OK");

        // Give the OS enough time to transfer focus to the target window.
        std::thread::sleep(std::time::Duration::from_millis(300));
        println!("[hide_and_paste] sleep done, firing Ctrl+V");

        let mut enigo = Enigo::new(&Settings::default()).map_err(|e| {
            let msg = format!("[hide_and_paste] enigo init error: {e}");
            println!("{msg}");
            msg
        })?;

        enigo
            .key(Key::Control, Direction::Press)
            .map_err(|e| e.to_string())?;
        enigo
            .key(Key::Unicode('v'), Direction::Click)
            .map_err(|e| e.to_string())?;
        enigo
            .key(Key::Control, Direction::Release)
            .map_err(|e| e.to_string())?;

        println!("[hide_and_paste] Ctrl+V sent");
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|app, _shortcut, event| {
                    if event.state() == ShortcutState::Pressed {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(),
        )
        .setup(|app| {
            // Ctrl+Shift+Space — avoids the Ctrl+Shift+V paste conflict
            // that terminals and editors handle themselves.
            let shortcut =
                Shortcut::new(Some(Modifiers::CONTROL | Modifiers::SHIFT), Code::Space);
            app.global_shortcut().register(shortcut)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, hide_and_paste])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
