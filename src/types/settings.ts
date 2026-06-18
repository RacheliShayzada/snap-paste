export type ThemeId = 'lavender' | 'teal' | 'coral' | 'slate';

export interface ThemeDef {
  id: ThemeId;
  label: string;
  accent: string;
  accentDim: string;
  accentGlow: string;
  hoverBg: string;
  hoverBorder: string;
  activeBg: string;
  subtle: string;
  subtleMid: string;
}

export const THEMES: Record<ThemeId, ThemeDef> = {
  lavender: {
    id: 'lavender',
    label: 'Lavender',
    accent: '#a78bfa',
    accentDim: '#7c3aed',
    accentGlow: 'rgba(167,139,250,0.45)',
    hoverBg: '#1c1529',
    hoverBorder: '#6d3fc7',
    activeBg: '#271a40',
    subtle: 'rgba(167,139,250,0.08)',
    subtleMid: 'rgba(167,139,250,0.13)',
  },
  teal: {
    id: 'teal',
    label: 'Teal',
    accent: '#2dd4bf',
    accentDim: '#0d9488',
    accentGlow: 'rgba(45,212,191,0.4)',
    hoverBg: '#0d2420',
    hoverBorder: '#14b8a6',
    activeBg: '#134e4a',
    subtle: 'rgba(45,212,191,0.08)',
    subtleMid: 'rgba(45,212,191,0.13)',
  },
  coral: {
    id: 'coral',
    label: 'Coral',
    accent: '#fb7185',
    accentDim: '#e11d48',
    accentGlow: 'rgba(251,113,133,0.4)',
    hoverBg: '#2d1019',
    hoverBorder: '#f43f5e',
    activeBg: '#4c0519',
    subtle: 'rgba(251,113,133,0.08)',
    subtleMid: 'rgba(251,113,133,0.13)',
  },
  slate: {
    id: 'slate',
    label: 'Slate',
    accent: '#94a3b8',
    accentDim: '#475569',
    accentGlow: 'rgba(148,163,184,0.35)',
    hoverBg: '#1a1f2a',
    hoverBorder: '#64748b',
    activeBg: '#1e293b',
    subtle: 'rgba(148,163,184,0.08)',
    subtleMid: 'rgba(148,163,184,0.13)',
  },
};

export interface HotkeyOption {
  id: string;
  label: string;
  shortcut: string;
}

export const HOTKEY_OPTIONS: HotkeyOption[] = [
  { id: 'ctrl+shift+space', label: 'Ctrl+Shift+Space', shortcut: 'Ctrl+Shift+Space' },
  { id: 'alt+shift+v',      label: 'Alt+Shift+V',      shortcut: 'Alt+Shift+V'      },
  { id: 'ctrl+shift+x',     label: 'Ctrl+Shift+X',     shortcut: 'Ctrl+Shift+X'     },
  { id: 'ctrl+alt+p',       label: 'Ctrl+Alt+P',       shortcut: 'Ctrl+Alt+P'       },
  { id: 'alt+v',            label: 'Alt+V',             shortcut: 'Alt+V'            },
];

export interface AppSettings {
  accentColor: ThemeId;
  hotkey: string;
  launchOnStartup: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  accentColor: 'lavender',
  hotkey: 'Ctrl+Shift+Space',
  launchOnStartup: false,
};
