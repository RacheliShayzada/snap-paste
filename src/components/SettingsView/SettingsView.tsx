import { THEMES, HOTKEY_OPTIONS } from '../../types/settings';
import type { AppSettings, ThemeId } from '../../types/settings';
import './SettingsView.css';

interface Props {
  settings: AppSettings;
  onColorChange: (c: ThemeId) => void;
  onHotkeyChange: (h: string) => void;
  onStartupChange: (enabled: boolean) => void;
  onBack: () => void;
}

export function SettingsView({ settings, onColorChange, onHotkeyChange, onStartupChange, onBack }: Props) {
  return (
    <div className="settings-view">
      <header className="settings-header">
        <button className="settings-back" onClick={onBack} title="Back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <h1 className="settings-title">Settings</h1>
      </header>

      <div className="settings-body">
        {/* ── Accent Color ── */}
        <section className="settings-section">
          <p className="settings-section-label">Accent Color</p>
          <div className="theme-palette">
            {(Object.values(THEMES) as typeof THEMES[ThemeId][]).map((theme) => (
              <button
                key={theme.id}
                className={`theme-swatch${settings.accentColor === theme.id ? ' theme-swatch--active' : ''}`}
                style={{ '--swatch-color': theme.accent } as React.CSSProperties}
                onClick={() => onColorChange(theme.id)}
                title={theme.label}
              />
            ))}
          </div>
          <p className="settings-hint">
            {THEMES[settings.accentColor].label}
          </p>
        </section>

        {/* ── Global Hotkey ── */}
        <section className="settings-section">
          <p className="settings-section-label">Global Hotkey</p>
          <select
            className="settings-select"
            value={settings.hotkey}
            onChange={(e) => onHotkeyChange(e.target.value)}
          >
            {HOTKEY_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.shortcut}>{opt.label}</option>
            ))}
          </select>
          <p className="settings-hint">Press this shortcut anywhere to open Snap Paste.</p>
        </section>

        {/* ── Launch on Startup ── */}
        <section className="settings-section">
          <label className="settings-toggle-row">
            <div>
              <p className="settings-section-label" style={{ marginBottom: 2 }}>Launch on Startup</p>
              <p className="settings-hint" style={{ marginTop: 0 }}>Start automatically with Windows.</p>
            </div>
            <button
              className={`toggle-switch${settings.launchOnStartup ? ' toggle-switch--on' : ''}`}
              onClick={() => onStartupChange(!settings.launchOnStartup)}
              role="switch"
              aria-checked={settings.launchOnStartup}
            >
              <span className="toggle-thumb" />
            </button>
          </label>
        </section>
      </div>
    </div>
  );
}
