use std::sync::Mutex;
use tauri::{AppHandle, Manager};

/// Simulates a Ctrl+V keystroke using Win32 SendInput with virtual key codes
/// (VK_CONTROL + VK_V). This is the only method applications reliably recognise
/// as a paste shortcut — enigo's Key::Unicode uses KEYEVENTF_UNICODE which
/// sends a raw Unicode character and is NOT treated as Ctrl+V by most apps.
#[cfg(target_os = "windows")]
fn send_ctrl_v() -> u32 {
    use windows_sys::Win32::UI::Input::KeyboardAndMouse::{
        SendInput, INPUT, INPUT_0, INPUT_KEYBOARD, KEYBDINPUT, KEYEVENTF_KEYUP, VK_CONTROL, VK_V,
    };

    let make = |vk: u16, flags: u32| -> INPUT {
        INPUT {
            r#type: INPUT_KEYBOARD,
            Anonymous: INPUT_0 {
                ki: KEYBDINPUT {
                    wVk: vk,
                    wScan: 0,
                    dwFlags: flags,
                    time: 0,
                    dwExtraInfo: 0,
                },
            },
        }
    };

    let inputs = [
        make(VK_CONTROL, 0),           // Ctrl down
        make(VK_V, 0),                 // V down
        make(VK_V, KEYEVENTF_KEYUP),   // V up
        make(VK_CONTROL, KEYEVENTF_KEYUP), // Ctrl up
    ];

    unsafe {
        SendInput(
            inputs.len() as u32,
            inputs.as_ptr(),
            std::mem::size_of::<INPUT>() as i32,
        )
    }
}

/// HWND of the window that was in the foreground before snap-paste was shown.
/// We restore it explicitly after hiding so that Ctrl+V lands in the right app.
struct PrevForeground(Mutex<isize>);

/// Called from JS when the global shortcut fires.
/// Saves the currently active window (the one to paste into), then shows
/// and focuses the snap-paste window.
#[tauri::command]
async fn show_window(app: AppHandle) -> Result<(), String> {
    // Capture the foreground HWND before our window steals focus.
    #[cfg(target_os = "windows")]
    {
        use windows_sys::Win32::UI::WindowsAndMessaging::GetForegroundWindow;
        let hwnd = unsafe { GetForegroundWindow() };
        *app.state::<PrevForeground>().0.lock().unwrap() = hwnd;
        println!("[show_window] saved prev foreground hwnd: {hwnd}");
    }

    if let Some(window) = app.get_webview_window("main") {
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
    }
    Ok(())
}

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

    // Read the HWND saved when the shortcut opened the window.
    let prev_hwnd = *app.state::<PrevForeground>().0.lock().unwrap();

    // Hide the window first so focus leaves our app.
    if let Some(window) = app.get_webview_window("main") {
        window.hide().map_err(|e| e.to_string())?;
        println!("[hide_and_paste] window hidden");
    } else {
        println!("[hide_and_paste] ERROR: could not find window 'main'");
    }

    // Offload all blocking work into spawn_blocking — SetForegroundWindow
    // and SendInput must run on the same thread for reliable focus transfer.
    tauri::async_runtime::spawn_blocking(move || -> Result<(), String> {
        // Write clipboard first, while no other app has had a chance to
        // interfere with it.
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

        // Give the OS a moment to finish processing the SW_HIDE.
        std::thread::sleep(std::time::Duration::from_millis(100));

        // Restore foreground RIGHT before SendInput — minimises the window
        // during which another event could steal focus again.
        #[cfg(target_os = "windows")]
        {
            use windows_sys::Win32::UI::WindowsAndMessaging::{
                GetForegroundWindow, SetForegroundWindow,
            };
            if prev_hwnd != 0 {
                let ok = unsafe { SetForegroundWindow(prev_hwnd) };
                let actual = unsafe { GetForegroundWindow() };
                println!(
                    "[hide_and_paste] SetForegroundWindow({prev_hwnd}) -> {ok}, \
                     actual foreground now: {actual}"
                );
            }
        }

        // Brief settle time for the focus transition to complete.
        std::thread::sleep(std::time::Duration::from_millis(50));
        println!("[hide_and_paste] firing Ctrl+V");

        #[cfg(target_os = "windows")]
        {
            let sent = send_ctrl_v();
            println!("[hide_and_paste] SendInput sent {sent} events (expected 4)");
        }

        println!("[hide_and_paste] done");
        Ok(())
    })
    .await
    .map_err(|e| e.to_string())?
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(PrevForeground(Mutex::new(0isize)))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        // Global shortcut plugin — shortcuts are registered from JS via
        // @tauri-apps/plugin-global-shortcut; this just initialises the plugin.
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec![]),
        ))
        .invoke_handler(tauri::generate_handler![greet, hide_and_paste, show_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
