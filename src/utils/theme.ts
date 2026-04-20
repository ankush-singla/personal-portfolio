export interface ThemePreset {
  name: string;
  bg: string;
  acc: string;
  fonts?: [string, string];
}

export const THEME_PRESETS: ThemePreset[] = [
  { name: 'monolith', bg: '#131313', acc: '#b87333', fonts: ['"Noto Serif", serif', '"Work Sans", sans-serif'] },
  { name: '8bit', bg: '#000000', acc: '#39ff14', fonts: ['"Press Start 2P"', '"Press Start 2P"'] },
  { name: 'minimal', bg: '#ffffff', acc: '#000000', fonts: ['"Helvetica Neue", sans-serif', '"Helvetica Neue", sans-serif'] },
  { name: 'cyberpunk', bg: '#050510', acc: '#ff00ff', fonts: ['"Courier New", monospace', '"Courier New", monospace'] },
  { name: 'basketball', bg: '#1a0f0a', acc: '#f26522', fonts: ['"Courier New", monospace', '"Arial Black", sans-serif'] },
  { name: 'photography', bg: '#000000', acc: '#aaaaaa', fonts: ['"Libre Baskerville", serif', '"Helvetica Neue", sans-serif'] },
  { name: 'terminal', bg: '#000000', acc: '#00ff00', fonts: ['"Courier New", monospace', '"Courier New", monospace'] },
  { name: 'ocean', bg: '#0f172a', acc: '#0ea5e9' },
  { name: 'abyss', bg: '#000000', acc: '#1e3a8a' },
  { name: 'forest', bg: '#022c22', acc: '#10b981' },
  { name: 'moss', bg: '#1c1917', acc: '#65a30d' },
  { name: 'neon-dracula', bg: '#282a36', acc: '#bd93f9' },
  { name: 'synthwave', bg: '#2b213a', acc: '#ff7edb' },
  { name: 'matrix', bg: '#000000', acc: '#00fa9a' },
  { name: 'volcano', bg: '#2a0a0a', acc: '#ef4444' },
  { name: 'blood', bg: '#100000', acc: '#dc2626' },
  { name: 'sunset', bg: '#1e1025', acc: '#f97316' },
  { name: 'dawn', bg: '#fafaf9', acc: '#fb923c' },
  { name: 'midnight', bg: '#171717', acc: '#3b82f6' },
  { name: 'slate', bg: '#0f172a', acc: '#64748b' },
  { name: 'lavender', bg: '#faf5ff', acc: '#a855f7' },
  { name: 'cobalt', bg: '#1e3a8a', acc: '#60a5fa' },
  { name: 'mustard', bg: '#1c1917', acc: '#eab308' },
  { name: 'sand', bg: '#fdfaef', acc: '#d97706' },
  { name: 'coffee', bg: '#292524', acc: '#8b5cf6' },
  { name: 'emerald-city', bg: '#022c22', acc: '#34d399' },
  { name: 'rose', bg: '#fff1f2', acc: '#e11d48' },
  { name: 'wine', bg: '#31101e', acc: '#fb7185' },
  { name: 'blizzard', bg: '#ffffff', acc: '#3b82f6' },
  { name: 'hacker', bg: '#000000', acc: '#00ff41', fonts: ['monospace', 'monospace'] },
  { name: 'outrun', bg: '#120458', acc: '#ff00a0' },
  { name: 'vaporwave', bg: '#ff71ce', acc: '#01cdfe' },
  { name: 'tokyo-night', bg: '#1a1b26', acc: '#7aa2f7' },
  { name: 'nord', bg: '#2e3440', acc: '#88c0d0' },
  { name: 'gruvbox-dark', bg: '#282828', acc: '#fabd2f' },
  { name: 'gruvbox-light', bg: '#fbf1c7', acc: '#d79921' },
  { name: 'solarized-dark', bg: '#002b36', acc: '#b58900' },
  { name: 'solarized-light', bg: '#fdf6e3', acc: '#cb4b16' },
  { name: 'dracula', bg: '#282a36', acc: '#ff79c6' },
  { name: 'monokai', bg: '#272822', acc: '#f92672' },
  { name: 'github-dark', bg: '#0d1117', acc: '#58a6ff' },
  { name: 'github-light', bg: '#ffffff', acc: '#0969da' },
  { name: 'vscode-dark', bg: '#1e1e1e', acc: '#007acc' },
  { name: 'blueprint', bg: '#0d47a1', acc: '#ffffff' },
  { name: 'halloween', bg: '#121212', acc: '#ff8800' },
  { name: 'christmas', bg: '#0b3d0b', acc: '#d32f2f' },
  { name: 'valetine', bg: '#ffe4e1', acc: '#ff1493' },
  { name: 'gold-rush', bg: '#111111', acc: '#ffd700' },
  { name: 'silver', bg: '#e0e0e0', acc: '#111111' },
  { name: 'neon-city', bg: '#050505', acc: '#00e5ff' },
  { name: 'retro-pop', bg: '#fceeb5', acc: '#ee5253' },
  { name: 'deep-purple', bg: '#1a0b2e', acc: '#c084fc' }
];

export function hexToRgb(hex: string) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function isLight(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  return getLuminance(r, g, b) > 0.5;
}

export function mixColors(hex1: string, hex2: string, ratio: number) {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  return rgbToHex(
    r1 * (1 - ratio) + r2 * ratio,
    g1 * (1 - ratio) + g2 * ratio,
    b1 * (1 - ratio) + b2 * ratio
  );
}

export function applyThemeToRoot(root: HTMLElement, themeId: string) {
  let preset = THEME_PRESETS.find(t => t.name === themeId);
  if (!preset) {
    // ALWAYS fallback to monolith if not found
    preset = THEME_PRESETS[0];
  }

  const isBgDark = !isLight(preset.bg);
  // Auto-calculated contrast colors
  const text = isBgDark ? '#e5e2e1' : '#1a1a1a';
  const textMuted = isBgDark ? '#a3a3a3' : '#52525b';
  const buttonText = isLight(preset.acc) ? '#000000' : '#ffffff';
  
  // Mix against white/black to generate surface step variations
  const tint = isBgDark ? '#ffffff' : '#000000';
  const s_lowest = mixColors(preset.bg, tint, -0.02); // Just in case we need darker
  const s_low = mixColors(preset.bg, tint, 0.04);
  const s_high = mixColors(preset.bg, tint, 0.08);
  const s_highest = mixColors(preset.bg, tint, 0.12);
  const outline = mixColors(preset.bg, text, 0.2); // 20% opacity border
  const teal = mixColors(preset.acc, tint, 0.4); // For the secondary 'teal' role

  root.style.setProperty('--color-surface', preset.bg);
  root.style.setProperty('--color-surface-lowest', isBgDark ? s_lowest : preset.bg);
  root.style.setProperty('--color-surface-low', s_low);
  root.style.setProperty('--color-surface-high', s_high);
  root.style.setProperty('--color-surface-highest', s_highest);
  
  root.style.setProperty('--color-on-surface', text);
  root.style.setProperty('--color-charcoal', buttonText); // Text color FOR THE COPPER BUTTON
  root.style.setProperty('--color-copper', preset.acc);
  root.style.setProperty('--color-copper-deep', mixColors(preset.acc, '#000000', 0.2));
  root.style.setProperty('--color-teal', teal);
  root.style.setProperty('--color-outline-suggested', outline);

  if (preset.fonts) {
    root.style.setProperty('--font-serif', preset.fonts[0]);
    root.style.setProperty('--font-sans', preset.fonts[1]);
  } else {
    // Default system
    root.style.setProperty('--font-serif', '"Inter", sans-serif');
    root.style.setProperty('--font-sans', '"Inter", sans-serif');
  }
}
