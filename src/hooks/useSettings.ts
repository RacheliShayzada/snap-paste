import { useState, useEffect, useRef } from 'react';
import { Store } from '@tauri-apps/plugin-store';
import { enable, disable } from '@tauri-apps/plugin-autostart';
import { invoke } from '@tauri-apps/api/core';
import { THEMES, DEFAULT_SETTINGS } from '../types/settings';
import type { AppSettings, ThemeId, ColorMode } from '../types/settings';

const STORE_FILE = 'settings.json';
const STORE_KEY = 'settings';

export function applyMode(mode: ColorMode) {
  document.documentElement.setAttribute('data-mode', mode);
}

export function applyTheme(themeId: ThemeId, mode: ColorMode = 'dark') {
  const t = THEMES[themeId];
  const r = document.documentElement;
  r.style.setProperty('--accent', t.accent);
  r.style.setProperty('--accent-dim', t.accentDim);
  r.style.setProperty('--accent-glow', t.accentGlow);
  r.style.setProperty('--accent-subtle', t.subtle);
  r.style.setProperty('--accent-subtle-mid', t.subtleMid);
  // Hover/active bg differ: dark mode uses opaque dark colors, light mode uses
  // transparent rgba overlays so they look correct on a white background.
  if (mode === 'light') {
    r.style.setProperty('--accent-hover-bg',     t.subtle);
    r.style.setProperty('--accent-hover-border',  t.accentDim);
    r.style.setProperty('--accent-active-bg',     t.subtleMid);
  } else {
    r.style.setProperty('--accent-hover-bg',     t.hoverBg);
    r.style.setProperty('--accent-hover-border',  t.hoverBorder);
    r.style.setProperty('--accent-active-bg',     t.activeBg);
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const storeRef = useRef<Store | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const store = await Store.load(STORE_FILE);
      if (!mounted) return;
      storeRef.current = store;

      const saved = await store.get<AppSettings>(STORE_KEY);
      const resolved: AppSettings = { ...DEFAULT_SETTINGS, ...(saved ?? {}) };

      setSettings(resolved);
      applyMode(resolved.colorMode);
      applyTheme(resolved.accentColor, resolved.colorMode);

      // Apply the saved shortcut in Rust (default registered in setup is Ctrl+Shift+Space).
      // This is a no-op if the saved value matches the default.
      try {
        await invoke('set_hotkey', { shortcut: resolved.hotkey });
      } catch (err) {
        console.warn('[useSettings] failed to apply saved shortcut:', err);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const persist = async (updated: AppSettings) => {
    const store = storeRef.current;
    if (store) {
      await store.set(STORE_KEY, updated);
      await store.save();
    }
  };

  const setAccentColor = async (color: ThemeId) => {
    applyTheme(color, settings.colorMode);
    const updated = { ...settings, accentColor: color };
    setSettings(updated);
    await persist(updated);
  };

  const setHotkey = async (shortcut: string) => {
    try {
      await invoke('set_hotkey', { shortcut });
    } catch (err) {
      console.warn('[useSettings] failed to set shortcut:', err);
    }
    const updated = { ...settings, hotkey: shortcut };
    setSettings(updated);
    await persist(updated);
  };

  const setColorMode = async (mode: ColorMode) => {
    applyMode(mode);
    applyTheme(settings.accentColor, mode);
    const updated = { ...settings, colorMode: mode };
    setSettings(updated);
    await persist(updated);
  };

  const setLaunchOnStartup = async (enabled: boolean) => {
    try {
      if (enabled) {
        await enable();
      } else {
        await disable();
      }
    } catch (err) {
      console.warn('[useSettings] autostart error:', err);
    }
    const updated = { ...settings, launchOnStartup: enabled };
    setSettings(updated);
    await persist(updated);
  };

  return { settings, setAccentColor, setHotkey, setLaunchOnStartup, setColorMode };
}
